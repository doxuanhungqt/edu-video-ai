const C = window.EDU_CONFIG || {}; let sb = null, currentUser = null;
const getEl = function(id) { return document.getElementById(id); };
if (C.SUPABASE_URL && C.SUPABASE_PUBLISHABLE_KEY) sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_PUBLISHABLE_KEY);

function msg(el, text, type) { if (el) { el.textContent = text; el.className = "msg " + (type || ""); } }

function showApp(profile) {
  getEl("gate").classList.add("hidden"); getEl("app").classList.remove("hidden"); getEl("logoutBtn").classList.remove("hidden");
  getEl("userName").textContent = profile?.full_name || currentUser?.email?.split("@")[0] || "giáo viên"; 
  if (currentUser?.email?.toLowerCase() === C.OWNER_EMAIL.toLowerCase()) getEl("ownerPanel").classList.remove("hidden");
  loadVideos();
}

async function login() {
  const email = getEl("email").value.trim(), password = getEl("password").value;
  if (!email || !password) return msg(getEl("authMsg"), "Vui lòng nhập đầy đủ email và mật khẩu.", "error");
  const res = await sb.auth.signInWithPassword({ email, password }); 
  if (res.error) return msg(getEl("authMsg"), res.error.message, "error"); 
  currentUser = res.data.user;
  const pRes = await sb.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();
  if (!pRes.data && email.toLowerCase() === C.OWNER_EMAIL.toLowerCase()) {
    const ins = await sb.from("profiles").insert({ id: currentUser.id, email, role: "OWNER", active: true, full_name: "Admin" }).select().maybeSingle();
    if (ins.data) return showApp(ins.data);
  }
  showApp(pRes.data);
}

function generate() {

  const subject = getEl("subject").value;
  const grade = getEl("grade").value;
  const audience = getEl("audience").value;
  let audienceStyle = "";
let recommendedVoice = "";
if (audience.includes("Mầm non")) {

  audienceStyle =
  "Use colorful cartoon style, simple language, cute characters, playful learning atmosphere.";

  recommendedVoice =
  "👧 Bé gái Việt Nam hoặc 👦 Bé trai Việt Nam, giọng vui tươi, hồn nhiên.";
}

else if (audience.includes("Tiểu học")) {

  audienceStyle =
  "Use friendly educational style, bright colors, simple explanations, engaging student interaction.";

  recommendedVoice =
  "👧 Bé gái Việt Nam hoặc 🎤 Người dẫn chương trình thiếu nhi, giọng trong sáng, thân thiện.";

}

else if (audience.includes("THCS")) {

  audienceStyle =
  "Use scientific educational style, clear explanation, teacher-guided learning, realistic school environment.";

  recommendedVoice =
  "👩 Nữ giáo viên Việt Nam hoặc 👨 Nam giáo viên Việt Nam, giọng rõ ràng, truyền cảm.";

}

else if (audience.includes("THPT")) {
  audienceStyle =
  "Use academic style, deeper explanation, critical thinking, professional educational presentation.";
  recommendedVoice =
"👨 Nam giáo viên Việt Nam hoặc 👩 Nữ giáo viên Việt Nam, giọng chuyên nghiệp, truyền cảm.";
}

else if (audience.includes("Giáo viên")) {

  audienceStyle =
  "Use professional teacher training style, clear structure, educational presentation.";

  recommendedVoice =
  "👩 Nữ giáo viên Việt Nam hoặc 👨 Nam giáo viên Việt Nam, giọng chuyên nghiệp, rõ ràng.";

}
  const topic = getEl("topic").value;
  const purpose = getEl("purpose").value;
 const durationText = getEl("duration").value;

let duration = 60;

if(durationText.includes("giây")){
  duration = Number(durationText.replace("giây","").trim());
}

if(durationText.includes("phút")){
  duration = Number(durationText.replace("phút","").trim()) * 60;
}
  const ratio = getEl("ratio").value;
  const style = getEl("style").value;
  const voice = getEl("voice").value;
  const extra = getEl("extra").value;


  let scenes = 5;

  if (duration <= 15) {
    scenes = 3;
  } else if (duration <= 60) {
    scenes = 5;
  } else if (duration <= 120) {
    scenes = 10;
  } else if (duration <= 180) {
    scenes = 15;
  } else {
    scenes = 20;
  }


  const timePerScene = Math.floor(duration / scenes);

  let storyboard = "";
const sceneRoles = [
  "Khởi động – tạo hứng thú",
  "Khám phá kiến thức mới",
  "Minh họa và hướng dẫn",
  "Thực hành trải nghiệm",
  "Tổng kết và ghi nhớ"
];

  for (let i = 1; i <= scenes; i++) {

    const start = (i - 1) * timePerScene;
    const end = i * timePerScene;

const role = sceneRoles[(i - 1) % sceneRoles.length];
    storyboard += `
<div class="scene">

<h3>🎬 Cảnh ${i} (${start}s - ${end}s)</h3>
<p>
🎬 <b>Vai trò cảnh:</b><br>
${role}
</p>
<p>
🏫 <b>Bối cảnh:</b><br>
Môi trường giáo dục Việt Nam, phù hợp với học sinh lớp ${grade}.
</p>

<p>
👥 <b>Nhân vật:</b><br>
Học sinh Việt Nam đúng độ tuổi, giáo viên hướng dẫn, biểu cảm tự nhiên.
</p>
<p>
🎯 <b>Mục tiêu:</b><br>
Trình bày nội dung ${topic} cho học sinh lớp ${grade}.
</p>

<p>
🖼 <b>Hình ảnh gợi ý:</b><br>
Minh họa ${topic}, phong cách ${style}.
</p>

<p>
🎥 <b>Prompt video AI:</b>
</p>

<div class="prompt">
Educational cinematic video scene ${i}.

Topic:
${topic}

Scene role:
${role}

Educational level:
Grade ${grade}

Audience:
${audience}

Location:
Vietnamese school environment, suitable for students.

Characters:
Vietnamese students and teacher, correct age,
natural expressions and movements.

Camera:
Smooth camera movement,
wide shot and close-up shots,
cinematic educational style.

Lighting:
Natural daylight,
bright and friendly classroom atmosphere.

Visual style:
${style}

Audience adaptation:
${audienceStyle}

Recommended voice:
${recommendedVoice}

Aspect ratio:
${ratio}

Motion:
Natural human movement,
realistic animation,
clear educational demonstration.

Negative prompt:
No violence,
no unsafe actions,
no distorted faces,
no unrealistic characters.

Additional requirements:
${extra}
</div>


<p>
🎙 <b>Lời thoại:</b><br>
Giọng ${voice}:

${
i === 1 
? "Xin chào các em. Hôm nay chúng ta cùng khám phá " + topic + ". Hãy chú ý quan sát và tham gia hoạt động nhé."

: i === scenes
? "Qua bài học hôm nay, các em đã hiểu được những kiến thức quan trọng về " + topic + ". Hãy vận dụng vào thực tế."

: "Các em hãy cùng tìm hiểu nội dung tiếp theo về " + topic + ". Hãy quan sát, thực hành và ghi nhớ những kiến thức quan trọng."
}
</p>
<p>
🎵 <b>Âm thanh:</b><br>
Nhạc nền phù hợp với nội dung giáo dục,
âm thanh môi trường tự nhiên,
tạo cảm giác tích cực và hứng thú cho học sinh.
</p>
</div>
`;

  }


  getEl("output").innerHTML =
  `
<h2>🎬 STORYBOARD AI</h2>

<p>
📚 Môn: ${subject}<br>
🎓 Lớp: ${grade}<br>
⏱ Thời lượng: ${duration} giây<br>
🎞 Số cảnh: ${scenes}
</p>
`;


  getEl("output").classList.remove("hidden");
getEl("output").innerHTML += storyboard;

  if (sb && currentUser) {

    sb.from("videos").insert({

      title: topic,
      subject,
      grade,
      topic,
      level: "Giáo dục",
      description: purpose,
      prompt: storyboard,
      duration,
      scene_count: scenes,
      status: "DRAFT"

    }).then(() => loadVideos());

  }

}

async function loadVideos() {
  const box = getEl("videoList"); if (!box) return; box.innerHTML = "<p class='muted'>Đang tải kho video...</p>";
  const res = await sb.from("videos").select("*").order("created_at", { ascending: false });
  if (res.error || !res.data.length) { box.innerHTML = "<p class='muted'>Chưa có video nào.</p>"; return; }
  box.innerHTML = res.data.map(function(v) {
    let btnHtml = "";
    if (v.status === "DRAFT") {
      btnHtml = '<button class="primary" style="margin:0; padding:6px 12px;" onclick="processVideoJob(\'' + v.id + '\')">🤖 Sinh Video AI</button>';
    }
    return '<div class="scene"><h3>🎬 ' + v.title + '</h3><p>Trạng thái: <b>' + v.status + '</b></p>' + (v.video_url ? '<video src="' + v.video_url + '" controls style="width:100%; max-height:240px; margin:10px 0; border-radius:8px; background:#000;"></video>' : "") + '<div style="margin-top:10px; display:flex; gap:8px;">' + btnHtml + '<button class="danger" style="margin:0; padding:6px 12px;" onclick="deleteVideo(\'' + v.id + '\')">🗑 Xóa</button></div></div>';
  }).join("");
}

async function processVideoJob(jobId) {
  await sb.from("videos").update({ status: "PROCESSING" }).eq("id", jobId); loadVideos();
  alert("AI Hugging Face đang bắt đầu dựng video mới. Tiến trình render miễn phí mất từ 2-4 phút, vui lòng giữ nguyên tab trình duyệt!");
  try {
    const res = await sb.from("videos").select("*").eq("id", jobId).single();
    const response = await fetch("https://huggingface.co", {
      method: "POST", headers: {  "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: res.data.prompt, parameters: { num_frames: 16 } }),
    });
    if (!response.ok) throw new Error("Mô hình AI đang quá tải.");
    const blob = await response.blob(), fileName = "ai-" + Date.now() + "-" + jobId + ".mp4";
    await sb.storage.from("videos").upload(fileName, blob, { contentType: "video/mp4" });
    const urlRes = sb.storage.from("videos").getPublicUrl(fileName);
    await sb.from("videos").update({ status: "COMPLETED", video_url: urlRes.data.publicUrl }).eq("id", jobId);
    alert("🎉 Xuất video thành công!"); loadVideos();
  } catch (e) { alert("Lỗi AI: " + e.message); await sb.from("videos").update({ status: "DRAFT" }).eq("id", jobId); loadVideos(); }
}

async function deleteVideo(id) { if (confirm("Xóa video này?")) { await sb.from("videos").delete().eq("id", id); loadVideos(); } }

getEl("loginBtn").onclick = login;
if(getEl("generateBtn")) getEl("generateBtn").onclick = generate;
getEl("logoutBtn").onclick = async function() { if (sb) await sb.auth.signOut(); currentUser = null; getEl("gate").classList.remove("hidden"); getEl("app").classList.add("hidden"); getEl("logoutBtn").classList.add("hidden"); };
if (sb) sb.auth.getSession().then(async function(res) { if (res.data?.session) { currentUser = res.data.session.user; const p = await sb.from("profiles").select("*").eq("id", currentUser.id).maybeSingle(); showApp(p.data); } });
