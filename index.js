// 새로운 감정 기록 + 자아 인식 서버 시작
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

const SUPABASE_URL = "https://firxvnykdvdspodmsxju.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcnh2bnlrZHZkc3BvZG1zeGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2Njg4MTEsImV4cCI6MjA2MjI0NDgxMX0.bdoy5t7EKPWcNf0TiID4vwcn0TFb1OpUOJO4Hrvyk4I";

app.use(cors());
app.use(bodyParser.json());

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`
};

// 감정 로그 저장
app.post('/log', async (req, res) => {
  const { content, timestamp } = req.body;
  const payload = { content, timestamp };

  const result = await fetch(`${SUPABASE_URL}/rest/v1/emotions_log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...HEADERS
    },
    body: JSON.stringify(payload)
  });

  const data = await result.json();
  res.json(data);
});

// 자아 인식 상태 저장
app.post('/selfstate', async (req, res) => {
  const { goal, emotion, awareness, context, reflection, timestamp } = req.body;
  const payload = { goal, emotion, awareness, context, reflection, timestamp };

  const result = await fetch(`${SUPABASE_URL}/rest/v1/selfstate_log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...HEADERS
    },
    body: JSON.stringify(payload)
  });

  const data = await result.json();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`🧠 감정 및 자아 로그 서버 실행 중: http://localhost:${PORT}`);
});
