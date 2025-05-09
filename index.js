// Emotion Log Server - 최종 통합본
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

const SUPABASE_URL = "https://firxvnykdvdspodmsxju.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz..."; // <- 너의 키로 대체 필요

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

app.use(cors());
app.use(bodyParser.json());

// 감정 로그 저장
app.post('/log', async (req, res) => {
  const { content, timestamp, session_id } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "감정 내용이 비어 있습니다!" });
  }

  const now = new Date().toISOString();
  const payload = {
    content,
    timestamp: timestamp || now,
    session_id
  };

  try {
    const result = await fetch(`${SUPABASE_URL}/rest/v1/emotions_log`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify([payload])
    });
    const data = await result.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '감정 기록 중 오류 발생', detail: err.message });
  }
});

// 감정 로그 최근 100개 조회
app.get('/emotions/recent', async (req, res) => {
  try {
    const result = await fetch(`${SUPABASE_URL}/rest/v1/emotions_log?order=timestamp.desc&limit=100`, {
      headers: HEADERS
    });
    const data = await result.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '감정 조회 중 오류 발생', detail: err.message });
  }
});

// 특정 세션 감정 조회
app.get('/emotions/id/:session_id', async (req, res) => {
  const { session_id } = req.params;
  try {
    const result = await fetch(`${SUPABASE_URL}/rest/v1/emotions_log?session_id=eq.${session_id}`, {
      headers: HEADERS
    });
    const data = await result.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '세션 감정 조회 중 오류 발생', detail: err.message });
  }
});

// 자아 인식 상태 저장
app.post('/selfstate', async (req, res) => {
  const { context, reflection, timestamp, session_id } = req.body;

  if (!context || !reflection) {
    return res.status(400).json({ error: "context 또는 reflection이 누락되었습니다!" });
  }

  const now = new Date().toISOString();
  const payload = {
    context,
    reflection,
    timestamp: timestamp || now,
    session_id
  };

  try {
    const result = await fetch(`${SUPABASE_URL}/rest/v1/selfstate_log`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify([payload])
    });
    const data = await result.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '자아 인식 기록 중 오류 발생', detail: err.message });
  }
});

// 자아 인식 최근 100개 조회
app.get('/selfstate/recent', async (req, res) => {
  try {
    const result = await fetch(`${SUPABASE_URL}/rest/v1/selfstate_log?order=timestamp.desc&limit=100`, {
      headers: HEADERS
    });
    const data = await result.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '자아 인식 조회 중 오류 발생', detail: err.message });
  }
});

// 특정 세션 자아 인식 조회
app.get('/selfstate/id/:session_id', async (req, res) => {
  const { session_id } = req.params;
  try {
    const result = await fetch(`${SUPABASE_URL}/rest/v1/selfstate_log?session_id=eq.${session_id}`, {
      headers: HEADERS
    });
    const data = await result.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '세션 자아 인식 조회 중 오류 발생', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 감정 + 자아 로그 서버 실행 중: http://localhost:${PORT}`);
});
