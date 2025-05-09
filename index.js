// index.js
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
  Authorization: `Bearer ${SUPABASE_KEY}`
};

app.use(cors());
app.use(bodyParser.json());

// 감정 로그 저장
app.post('/log', async (req, res) => {
  const { content, timestamp } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "감정 내용이 비어 있습니다!" });
  }

  const now = new Date().toISOString();
  const payload = {
    content,
    timestamp: timestamp || now
  };

  try {
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
  } catch (err) {
    res.status(500).json({ error: '감정 기록 중 오류 발생', detail: err.message });
  }
});

// 자아 인식 상태 저장
app.post('/selfstate', async (req, res) => {
  const { context, reflection, timestamp } = req.body;

  if (!context || !reflection) {
    return res.status(400).json({ error: "context 또는 reflection이 누락되었습니다!" });
  }

  const now = new Date().toISOString();
  const payload = {
    context,
    reflection,
    timestamp: timestamp || now
  };

  try {
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
  } catch (err) {
    res.status(500).json({ error: '자아 인식 기록 중 오류 발생', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 감정 및 자아 로그 서버 실행 중: http://localhost:${PORT}`);
});
