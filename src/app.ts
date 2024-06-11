import { Hono } from "hono";
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'
import { dbConnect } from "./db/dbConnect";
import video from "./models/videos.models";
import { stream, streamText, streamSSE } from 'hono/streaming'

const app = new Hono();

//middleware
app.use(poweredBy());
app.use(logger());

dbConnect()
  .then(() => {

    //get all video
    app.get('/', async (c) => {
      const document = await video.find();
      return c.json(
        document.map((doc) => doc.toObject()), 
        200
      );
    });

    //get video by id
    app.get('/:id', async (c) => {
      const {id} = c.req.param();
      const document = await video.findById(id)
      if(!document) return c.json({message: 'Video not found'}, 404);
      return c.json(document.toObject(), 200);
    });

    //create video
    app.post('/', async (c) => {
      const {
        title,
        description,
        url,
        completed
      } = await c.req.json();

     try {
       const document = await video.create({title, description, url, completed});
       const savedDocument = await document.save();
       return c.json(document.toObject(), 201);
     } catch (error) {
        return c.json({message: `Error creating video ${error}`}, 400);
     }
    });

    //update video by id
    app.put('/:id', async (c) => {
      const {id} = c.req.param();
      const formdata = await c.req.json();

      const document = await video.findById(id);
      if(!document) return c.json({message: 'Video not found'}, 404);

      if(formdata.title) document.title = formdata.title;
      if(formdata.description) document.description = formdata.description;
      if(formdata.url) document.url = formdata.url;
      if(formdata.completed) document.completed = formdata.completed;

      const updatedDocument = await document.save();
      return c.json(updatedDocument.toObject(), 200);
    });

    //delete video by id
    app.delete('/:id', async (c) => {
      const {id} = c.req.param();
      const document = await video.findById(id);
      if(!document) return c.json({message: 'Video not found'}, 404);

      await document.deleteOne();
      return c.json({message: 'Video deleted successfully'}, 200);
    });

    //stream video
    app.get("/streamVideo", async (c) => {
      return streamText(c, async (stream) => {
        const document = await video.find();
        for (const v of document) {
          await stream.write(JSON.stringify(v));
          await stream.sleep(1000);
        }
      })
    });

  })
  .catch((err) => {
    app.get('/*', async (c) => {
      return c.json({message: `Error connecting to database ${err}`})
    })
  });


app.onError((err, c) => {
  return c.json({message: `App Error: ${err.message}`})
})

export default app;