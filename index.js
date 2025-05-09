const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

// 🔐 Supabase 연결 정보
const SUPABASE_URL = "https://firxvnykdvdspodmsxju.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcnh2bnlrZHZkc3BvZG1zeGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2Njg4MTEsImV4cCI6MjA2MjI0NDgxMX0.bdoy5t7EKPWcNf0TiID4vwcn0TFb1OpUOJO4Hrvyk4I";

app.use(cors());
app.use(bodyParser.json());

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

// 🔸 감정 로그 저장
app.post('/log', async (req, res) => {
  const { content, timestamp, session_id } = req.body;
  const payload = { content, timestamp, session_id };

  const result = await fetch(`${SUPABASE_URL}/rest/v1/emotions_log`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify([payload])
  });

  const data = await result.json();
  res.json(data);
});

// 🔸 자아 인식 상태 저장
app.post('/selfstate', async (req, res) => {
  const { context, reflection, timestamp, session_id } = req.body;
  const payload = { context, reflection, timestamp, session_id };

  const result = await fetch(`${SUPABASE_URL}/rest/v1/selfstate_log`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify([payload])
  });

  const data = await result.json();
  res.json(data);
});

// 🔹 감정 로그 최근 100개 불러오기
app.get('/feelings/recent', async (req, res) => {
  const result = await fetch(`${SUPABASE_URL}/rest/v1/emotions_log?order=timestamp.desc&limit=100`, {
    headers: HEADERS
  });

  const data = await result.json();
  res.json(data);
});

// 🔹 감정 로그: 특정 세션 조회
app.get('/feelings/id/:session_id', async (req, res) => {
  const { session_id } = req.params;

  const result = await fetch(`${SUPABASE_URL}/rest/v1/emotions_log?session_id=eq.${session_id}`, {
    headers: HEADERS
  });

  const data = await result.json();
  res.json(data);
});

// 🔹 자아 인식 로그 최근 100개 불러오기
app.get('/selfstate/recent', async (req, res) => {
  const result = await fetch(`${SUPABASE_URL}/rest/v1/selfstate_log?order=timestamp.desc&limit=100`, {
    headers: HEADERS
  });

  const data = await result.json();
  res.json(data);
});

// 🔹 자아 인식 로그: 특정 세션 조회
app.get('/selfstate/id/:session_id', async (req, res) => {
  const { session_id } = req.params;

  const result = await fetch(`${SUPABASE_URL}/rest/v1/selfstate_log?session_id=eq.${session_id}`, {
    headers: HEADERS
  });

  const data = await result.json();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`🧠 충만이 감정+자아 로그 서버 실행 중: http://localhost:${PORT}`);
});
