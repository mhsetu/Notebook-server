const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://NotebookDB:qVxdPbYzIUHFV2PF@cluster0.rwfgqco.mongodb.net/?appName=Cluster0`;

app.get('/', (req, res) => {
  res.send(`It's working`);
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const NoteCollection = client.db('notebookDB').collection('Notes');

    app.post('/notes', async (req, res) => {
      const notes = req.body;
      console.log(notes);
      const result = await NoteCollection.insertOne(notes);
      console.log(result);
      res.send(result);
    });

    app.get('/note', async (req, res) => {
      const query = {};
      const cursor = await NoteCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/note/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await NoteCollection.find(query).toArray();
      res.send(result);
    });

    app.delete('/note/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await NoteCollection.deleteOne(query);
      res.send(result);
    });
    app.patch('/note/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      // console.log(query);
      const updatedDoc = {
        $set: {
          title: req.body.title,
          message: req.body.message,
        },
      };
      console.log(updatedDoc);
      const result = NoteCollection.updateOne(query, updatedDoc);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log('Server is running', port);
});
