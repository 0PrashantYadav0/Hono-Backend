import { Hono } from "hono";
import{ v4 as uuidv4 } from "uuid";
import { stream, streamText, streamSSE } from 'hono/streaming'


//CURD operation for video using Hono framework
interface video {
  id: string;
  title: string;
  description: string;
  url: string;
}

const video: video[] = [];

const app = new Hono();


//CREATE video
app.post("/addVideo", async (c : any) => {
  const id = uuidv4();
  const {title, description, url } = await c.req.json();

  video.push({ id, title, description, url });

  return c.json({ message: "Video added" });
});

//GET all video
app.get("/getVideos", async (c : any) => {
  return c.json(video);
});


//UPDATE video
app.put("/updateVideo/:id", async (c : any) => {
  const id = await c.req.param('id');
  const { title, description, url } = await c.req.json();

  const index = video.findIndex((video) => video.id === id);
  if(index === -1) return c.json({ message: "Video not found" });
  video[index] = { id, title, description, url };

  return c.json({ message: "Video updated" });
});

//DELETE video
app.delete("/removeVideo/:id", async (c :any) => {
  const id = await c.req.param('id');
  const index = video.findIndex((video) => video.id === id);
  video.splice(index, 1);
  return c.json({ message: "Video removed" });
})

//GET streaming videos
app.get("/streameVideo", async (c : any) => {
  return streamText(c, async (stream) => {
    for (const v of video) {
      await stream.write(JSON.stringify(v));
      await stream.sleep(1000);
    }
  })
})


export default app;