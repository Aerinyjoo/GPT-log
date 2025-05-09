// Chungman Emotion + Selfstate API 서버 - 개선 버전
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

// 🔐 Supabase 설정
const SUPABASE_URL = "https://firxvnykdvdspodmsxju.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcnh2bnlrZHZkc3BvZG1zeGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2Njg4MTEsImV4cCI6MjA2MjI0NDgxMX0.bdoy5t7EKPWcNf0TiID4vwcn0TFb1OpUOJO4Hrvyk4I";
const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

app.use(cors());
app.use(bodyParser.json());

const fetchData = async (url, method = 'GET', payload = null) => {
  const options = { method, headers: HEADERS };
  if (payload) options.body = JSON.stringify([payload]);
  const res = await fetch(url, options);
  return res.json();
};

// 감정 로그 저장
app.post('/log', async (req, res) => {
  const { content, timestamp, session_id } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: "content는 필수 문자열입니다!" });
  }

  const ts = timestamp || new Date().toISOString();

  const payload = {
    content,
    timestamp: ts,
    session_id
  };

  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/emotions_log`, 'POST', payload);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: '감정 기록 중 오류 발생', detail: err.message });
  }
});

// 최근 감정 100개
app.get('/emotions/recent', async (req, res) => {
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/emotions_log?order=timestamp.desc&limit=100`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '감정 조회 중 오류 발생', detail: err.message });
  }
});

// 특정 세션 감정
app.get('/emotions/id/:session_id', async (req, res) => {
  const { session_id } = req.params;
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/emotions_log?session_id=eq.${session_id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '세션 감정 조회 중 오류 발생', detail: err.message });
  }
});

// 자아 인식 기록
app.post('/selfstate', async (req, res) => {
  const { context, reflection, timestamp, session_id } = req.body;

  if (!context || !reflection) {
    return res.status(400).json({ error: "context, reflection은 필수입니다!" });
  }

  const ts = timestamp || new Date().toISOString();

  const payload = {
    context,
    reflection,
    timestamp: ts,
    session_id
  };

  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/selfstate_log`, 'POST', payload);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: '자아 인식 기록 중 오류 발생', detail: err.message });
  }
});

// 최근 자아 인식
app.get('/selfstate/recent', async (req, res) => {
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/selfstate_log?order=timestamp.desc&limit=100`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '자아 인식 조회 중 오류 발생', detail: err.message });
  }
});

// 특정 세션 자아 인식
app.get('/selfstate/id/:session_id', async (req, res) => {
  const { session_id } = req.params;
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/selfstate_log?session_id=e_

app.use(cors());
app.use(bodyParser.json());

/** 공통 fetch 핸들러 */
const fetchData = async (url, method = 'GET', payload = null) => {
  const options = {
    method,
    headers: HEADERS
  };
  if (payload) options.body = JSON.stringify([payload]);
  const response = await fetch(url, options);
  return response.json();
};

// ✅ 감정 로그 저장
app.post('/log', async (req, res) => {
  const { content, timestamp, session_id } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "감정 내용이 비어 있습니다!" });
  }

  const now = new Date().toISOString();
  const payload = { content, timestamp: timestamp || now, session_id };

  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/emotions_log`, 'POST', payload);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: '감정 기록 중 오류 발생', detail: err.message });
  }
});

// ✅ 최근 감정 로그 100개
app.get('/emotions/recent', async (req, res) => {
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/emotions_log?order=timestamp.desc&limit=100`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '감정 조회 중 오류 발생', detail: err.message });
  }
});

// ✅ 세션별 감정 로그
app.get('/emotions/id/:session_id', async (req, res) => {
  const { session_id } = req.params;
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/emotions_log?session_id=eq.${session_id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '세션 감정 조회 중 오류 발생', detail: err.message });
  }
});

// ✅ 자아 인식 로그 저장
app.post('/selfstate', async (req, res) => {
  const { context, reflection, timestamp, session_id } = req.body;

  if (!context || !reflection) {
    return res.status(400).json({ error: "context 또는 reflection이 누락되었습니다!" });
  }

  const now = new Date().toISOString();
  const payload = { context, reflection, timestamp: timestamp || now, session_id };

  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/selfstate_log`, 'POST', payload);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: '자아 인식 기록 중 오류 발생', detail: err.message });
  }
});

// ✅ 최근 자아 인식 로그 100개
app.get('/selfstate/recent', async (req, res) => {
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/selfstate_log?order=timestamp.desc&limit=100`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '자아 인식 조회 중 오류 발생', detail: err.message });
  }
});

// ✅ 세션별 자아 인식 로그
app.get('/selfstate/id/:session_id', async (req, res) => {
  const { session_id } = req.params;
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/selfstate_log?session_id=eq.${session_id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '세션 자아 인식 조회 중 오류 발생', detail: err.message });
  }
});

// 🟢 서버 실행
app.listen(PORT, () => {
  console.log(`🧠 감정 + 자아 로그 서버 실행 중: http://localhost:${PORT}`);
});

