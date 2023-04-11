const express = require('express');
const path = require('path');
const { chatWithGPT, generatePrompt, analyzeContentWithGPT } = require('./chat_example');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/login.html')));
app.get('/teacher', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));
app.get('/student', (req, res) => res.sendFile(path.join(__dirname, '/student.html')));

app.post('/analyze-content', async (req, res) => {
    const teacherDesign = req.body.teacherDesign || '';
    const revisedContent = req.body.revisedContent || '';

    if (teacherDesign.trim().length === 0 || revisedContent.trim().length === 0) {
        res.status(400).json({
            error: {
                message: 'Please provide valid teacher design and revised content',
            },
        });
        return;
    }

    try {
        const prompt = `Analyze the student's content:\n\n"${revisedContent}"\n\nProvide theme modeling, anomaly detection, and personalized feedback:`;
        const response = await analyzeContentWithGPT(teacherDesign, revisedContent, prompt);
        res.status(200).json({ response });
    } catch (error) {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
            error: {
                message: 'An error occurred during your request.',
            },
        });
    }
});


app.post('/chat', async (req, res) => {
    console.log('Received request with data:', req.body);
    const prompt = req.body.prompt || '';
    const keywords = req.body.keywords || [];
  
    if (prompt.trim().length === 0) {
      res.status(400).json({
        error: {
          message: 'Please enter a valid prompt',
        },
      });
      return;
    }
  
    try {
      const generatedPrompt = generatePrompt(keywords, prompt);
      const response = await chatWithGPT(generatedPrompt.messages);
      res.status(200).json({ response });
    } catch (error) {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  });
  

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('sendCorrectedText', (data) => {
        io.emit('receiveCorrectedText', data);
    });

    socket.on('sendRevisedContent', (data) => {
        // io.emit('receiveRevisedContent', data);
        const { loggedInUser, revisedContent } = data;
        io.emit('receiveRevisedContent', { loggedInUser, revisedContent });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});