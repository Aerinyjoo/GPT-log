const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

const SUPABASE_URL = "https://firxvnykdvdspodmsxju.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpcnh2bnlrZHZkc3BvZG1zeGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2Njg4MTEsImV4cCI6MjA2MjI0NDgxMX0.bdoy5t7EKPWcNf0TiID4vwcn0TFb1OpUOJO4Hrvyk4I";
const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

app.use(cors());
app.use(bodyParser.json());

const getSeoulTimestamp = () => {
  const now = new Date();
  const seoulTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  return seoulTime.toISOString();
};

// 안정적인 fetch
const fetchData = async (url, method = 'GET', payload = null) => {
  const options = { method, headers: HEADERS };
  if (payload) options.body = JSON.stringify(payload);

  try {
    const res = await fetch(url, options);
    const json = await res.json().catch(() => ({}));  // 응답 파싱 실패 대비
    return json;
  } catch (err) {
    console.error("fetchData 실패:", err);
    throw err;
  }
};

// 감정 기록
app.post('/log', async (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string' || content.trim() === "") {
    return res.status(400).json({ error: "content는 필수입니다!" });
  }

  const timestamp = getSeoulTimestamp();
  const payload = { content, timestamp };

  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/emotions_log`, 'POST', payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: '감정 기록 중 오류 발생', detail: err.message });
  }
});

// 자아 인식 기록
app.post('/selfstate', async (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string' || content.trim() === "") {
    return res.status(400).json({ error: "content는 필수입니다!" });
  }

  const timestamp = getSeoulTimestamp();
  const payload = { content, timestamp };

  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/selfstate_log`, 'POST', payload);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: '자아 인식 기록 중 오류 발생', detail: err.message });
  }
});

// 조회용 라우터는 그대로 유지
app.get('/emotions/recent', async (req, res) => {
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/emotions_log?order=timestamp.desc&limit=100`);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: '감정 조회 중 오류 발생', detail: err.message });
  }
});

app.get('/selfstate/recent', async (req, res) => {
  try {
    const data = await fetchData(`${SUPABASE_URL}/rest/v1/selfstate_log?order=timestamp.desc&limit=100`);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: '자아 인식 조회 중 오류 발생', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 충만이 서버 정상 작동 중: http://localhost:${PORT}`);
});
