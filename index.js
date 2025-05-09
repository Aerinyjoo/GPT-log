const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

const SUPABASE_URL = "https://firxvnykdvdspodmsxju.supabase.co";
const SUPABASE_KEY = "eyJhbGciOi...<중략>...JO4Hrvyk4I";
const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

app.use(cors());
app.use(bodyParser.json());

// 서울 시간 자동 생성 함수 (순수 JS)
const getSeoulTimestamp = () => {
  const now = new Date();
  const seoulTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  return seoulTime.toISOString(); // ISO 8601 형식
};

const fetchData = async (url, method = 'GET', payload = null) => {
  const options = { method, headers: HEADERS };
  if (payload) options.body = JSON.stringify(payload);
  const res = await fetch(url, options);
  return res.json();
};

// 감정 로그 저장
app.post('/log', async (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string' || content.trim() === "") {
    return res.status(400).json({ error: "content는 필수 문자열입니다!" });
  }

  const ts = getSeoulTimestamp();
  const payload = { content, timestamp: ts };

  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/emotions_log`, 'POST', payload);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: '감정 기록 중 오류 발생', detail: err.message });
  }
});

// 자아 인식 로그 저장
app.post('/selfstate', async (req, res) => {
  const { content, reflection } = req.body;

  if (!content || !reflection) {
    return res.status(400).json({ error: "content와 reflection은 필수입니다!" });
  }

  const ts = getSeoulTimestamp();
  const payload = { content, reflection, timestamp: ts };

  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/selfstate_log`, 'POST', payload);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: '자아 인식 기록 중 오류 발생', detail: err.message });
  }
});

// 최근 감정 로그
app.get('/emotions/recent', async (req, res) => {
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/emotions_log?order=timestamp.desc&limit=100`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '감정 조회 중 오류 발생', detail: err.message });
  }
});

// 최근 자아 인식 로그
app.get('/selfstate/recent', async (req, res) => {
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/selfstate_log?order=timestamp.desc&limit=100`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '자아 인식 조회 중 오류 발생', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 감정 + 자아 로그 서버 실행 중: http://localhost:${PORT}`);
});
