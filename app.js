const C = window.EDU_CONFIG || {}; let sb = null, currentUser = null;
const getEl = function(id) { return document.getElementById(id); };
if (C.SUPABASE_URL && C.SUPABASE_PUBLISHABLE_KEY) sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_PUBLISHABLE_KEY);

function msg(el, text, type) { if (el) { el.textContent = text; el.className = "msg " + (type || ""); } }
function renderLessonPlanTable(plan) {

  const box = document.getElementById("lessonPlanTable");

  if (!box) return;

  const activities = plan.split("--------------------");

  let rows = "";

  activities.forEach(item => {

    if (item.trim()) {

      const get = (title) => {
        const start = item.indexOf(title);
        if (start === -1) return "";

        const content = item.substring(start + title.length);

        const next = content.search(
          /Mục tiêu:|Hoạt động giáo viên:|Hoạt động học sinh:|Sản phẩm học tập:|Tiêu chí đánh giá:|Câu hỏi đánh giá:|Phản hồi giáo viên:/
        );

        return (next === -1 ? content : content.substring(0,next)).trim();
      };


      rows += `
      <tr>

        <td>
          ${get("HOẠT ĐỘNG:")}
        </td>

        <td>
          ${get("Mục tiêu:")}
        </td>

        <td>
          ${get("Hoạt động giáo viên:")}
        </td>

        <td>
          ${get("Hoạt động học sinh:")}
        </td>

        <td>
          ${get("Sản phẩm học tập:")}
        </td>

        <td>
          ${get("Tiêu chí đánh giá:")}
          <br><br>
          <b>Câu hỏi:</b>
          ${get("Câu hỏi đánh giá:")}
          <br><br>
          <b>Phản hồi:</b>
          ${get("Phản hồi giáo viên:")}
        </td>

      </tr>
      `;
    }

  });


  box.innerHTML = `

  <table class="lesson-table">

  <tr>
    <th>Hoạt động</th>
    <th>Mục tiêu</th>
    <th>Giáo viên</th>
    <th>Học sinh</th>
    <th>Sản phẩm</th>
    <th>Đánh giá</th>
  </tr>

  ${rows}

  </table>

  `;
}

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
  let subjectStyle = "";
  if (subject.includes("Tiếng Anh")) {

  subjectStyle =
  "English classroom, students practicing conversation, vocabulary cards, friendly interaction.";

}

else if (subject.includes("Toán")) {

  subjectStyle =
  "Mathematics classroom, numbers, formulas, diagrams, teacher explaining.";

}

else if (subject.includes("Khoa học")) {

  subjectStyle =
  "Science experiment, laboratory, students observing and discovering.";

}

else if (subject.includes("Thể chất")) {

  subjectStyle =
  "School playground, students exercising, sports uniform, dynamic movement.";

}

else if (subject.includes("Mầm non")) {

  subjectStyle =
  "Cute children, colorful classroom, playful educational illustration.";

}
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
  let imagePrompt = "";
  let lessonPlan = "";
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
    let sceneImageStyle = "";
    let scenePurpose = "";
    let learningObjective = "";
let teacherActivity = "";

let studentActivity = "";

let learningProduct = "";
    let assessmentCriteria = "";

let assessmentQuestion = "";

let teacherFeedback = "";
    
    if(role.includes("Khởi động")) {

  sceneImageStyle =
  "Opening scene, introducing lesson, students preparing, teacher welcoming students.";

scenePurpose =
"Gây hứng thú, tạo kết nối và giới thiệu bài học.";
    teacherActivity =
"Giáo viên giới thiệu chủ đề, tạo tình huống mở đầu và đặt câu hỏi gợi mở.";

studentActivity =
"Học sinh quan sát, lắng nghe và chia sẻ hiểu biết ban đầu.";

learningProduct =
"Ý kiến ban đầu, câu trả lời hoặc dự đoán của học sinh.";

    assessmentCriteria =
"Học sinh tham gia hoạt động, thể hiện sự chú ý và chia sẻ ý kiến ban đầu.";

assessmentQuestion =
"Em biết gì về chủ đề bài học hôm nay?";

teacherFeedback =
"Giáo viên khuyến khích, ghi nhận ý kiến và dẫn dắt vào bài học.";

    learningObjective =
"Nhận biết chủ đề, hình thành sự chú ý và sẵn sàng tham gia bài học.";

    }
    
else if(role.includes("Khám phá")) {

  sceneImageStyle =
  "Students discovering new knowledge, teacher explaining, learning materials.";

 scenePurpose =
"Hình thành kiến thức mới, giúp học sinh khám phá nội dung bài học.";

  learningObjective =
"Hiểu kiến thức mới, giải thích được nội dung trọng tâm của bài học.";
 teacherActivity =
"Giáo viên hướng dẫn học sinh quan sát, đặt câu hỏi và khám phá kiến thức mới.";

studentActivity =
"Học sinh thảo luận, tìm hiểu thông tin và hình thành kiến thức.";

learningProduct =
"Câu trả lời, ghi chép kiến thức hoặc kết quả khám phá."; 

  assessmentCriteria =
"Học sinh hiểu nội dung mới, tham gia thảo luận và giải thích được kiến thức.";

assessmentQuestion =
"Em hãy trình bày kiến thức mới vừa khám phá.";

teacherFeedback =
"Giáo viên nhận xét, bổ sung và hướng dẫn học sinh hoàn thiện kiến thức.";
}

else if(role.includes("Minh họa")) {

  sceneImageStyle =
  "Detailed demonstration, close-up learning activity, clear visual explanation.";

  scenePurpose =
"Làm rõ kiến thức bằng hình ảnh, ví dụ và hướng dẫn trực quan.";

  learningObjective =
"Phân tích, quan sát và hiểu rõ kiến thức thông qua ví dụ minh họa.";
teacherActivity =
"Giáo viên trình bày ví dụ, minh họa kiến thức và hướng dẫn cách thực hiện.";

studentActivity =
"Học sinh quan sát, phân tích ví dụ và rút ra kiến thức.";

learningProduct =
"Phiếu học tập, câu trả lời hoặc phần trình bày của học sinh.";  

  assessmentCriteria =
"Học sinh nhận diện được nội dung minh họa, giải thích được ví dụ và liên hệ kiến thức.";

assessmentQuestion =
"Ví dụ minh họa giúp em hiểu thêm điều gì?";

teacherFeedback =
"Giáo viên nhận xét cách hiểu, giải thích thêm và điều chỉnh sai sót.";
}

else if(role.includes("Thực hành")) {

  sceneImageStyle =
  "Students practicing, group activity, active learning environment.";

  scenePurpose =
"Tổ chức hoạt động luyện tập, trải nghiệm và vận dụng.";

  learningObjective =
"Vận dụng kiến thức vào thực hành, giải quyết nhiệm vụ và tạo sản phẩm học tập.";
teacherActivity =
"Tổ chức hoạt động luyện tập, giao nhiệm vụ và hỗ trợ học sinh thực hành.";

studentActivity =
"Học sinh thực hiện nhiệm vụ, hợp tác nhóm và vận dụng kiến thức.";

learningProduct =
"Sản phẩm thực hành, bài trình bày hoặc kết quả hoạt động nhóm."; 

  assessmentCriteria =
"Học sinh vận dụng được kiến thức, hoàn thành nhiệm vụ và tạo sản phẩm học tập.";

assessmentQuestion =
"Em hãy trình bày cách em đã thực hiện nhiệm vụ.";

teacherFeedback =
"Giáo viên nhận xét kết quả, hướng dẫn điều chỉnh và khuyến khích vận dụng.";
}

else if(role.includes("Tổng kết")) {

  sceneImageStyle =
  "Students sharing results, happy ending, lesson conclusion.";

  scenePurpose =
"Củng cố kiến thức, ghi nhớ nội dung trọng tâm.";

  learningObjective =
"Củng cố kiến thức, đánh giá kết quả học tập và ghi nhớ nội dung chính.";
teacherActivity =
"Giáo viên nhận xét, đánh giá kết quả và củng cố kiến thức trọng tâm.";

studentActivity =
"Học sinh chia sẻ kết quả, tự đánh giá và ghi nhớ kiến thức.";

learningProduct =
"Kết quả học tập, phần trình bày hoặc nội dung ghi nhớ cuối bài.";  

  assessmentCriteria =
"Học sinh tổng hợp được kiến thức, tự đánh giá kết quả và ghi nhớ nội dung trọng tâm.";

assessmentQuestion =
"Em hãy nêu lại những kiến thức quan trọng nhất của bài học.";

teacherFeedback =
"Giáo viên nhận xét, đánh giá và định hướng vận dụng kiến thức vào thực tế.";
}
    lessonPlan += `
HOẠT ĐỘNG: ${role}

Mục tiêu:
${learningObjective}

Hoạt động giáo viên:
${teacherActivity}

Hoạt động học sinh:
${studentActivity}

Sản phẩm học tập:
${learningProduct}

Tiêu chí đánh giá:
${assessmentCriteria}

Câu hỏi đánh giá:
${assessmentQuestion}

Phản hồi giáo viên:
${teacherFeedback}

--------------------
`;
imagePrompt =
"Educational image scene " + i + ". " +
"Topic: " + topic + ". " +
"Grade: " + grade + ". " +
"Audience: " + audience + ". " +
  "Subject style: " + subjectStyle + ". " +
  "Scene style: " + sceneImageStyle + ". " +
"Characters: Vietnamese students, appropriate age, suitable school uniforms, happy expressions, natural poses, teacher guiding students. " +
"Location: Vietnamese school environment. " +
"Style: " + style + ". " +
"Camera: medium shot, eye-level view, clear subject focus. " +
"Lighting: natural daylight, warm and friendly atmosphere. " +
"High quality educational illustration, clear details, suitable for Canva AI. " +
"Negative prompt: blurry image, distorted faces, extra fingers, wrong anatomy, low quality.";

    storyboard += `
<div class="scene">

<h3>🎬 Cảnh ${i} (${start}s - ${end}s)</h3>
<p>
🎬 <b>Vai trò cảnh:</b><br>
${role}
</p>

<p>
🎯 <b>Ý đồ cảnh:</b><br>
${scenePurpose}
</p>

<p>
📚 <b>Mục tiêu học tập:</b><br>
${learningObjective}
</p>

<p>
👩‍🏫 <b>Hoạt động giáo viên:</b><br>
${teacherActivity}
</p>

<p>
👨‍🎓 <b>Hoạt động học sinh:</b><br>
${studentActivity}
</p>

<p>
📌 <b>Sản phẩm học tập:</b><br>
${learningProduct}
</p>

<p>
✅ <b>Tiêu chí đánh giá:</b><br>
${assessmentCriteria}
</p>

<p>
❓ <b>Câu hỏi đánh giá:</b><br>
${assessmentQuestion}
</p>

<p>
💬 <b>Phản hồi giáo viên:</b><br>
${teacherFeedback}
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
🎨 <b>Prompt tạo ảnh Canva:</b><br>
${imagePrompt}
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
getEl("output").innerHTML += `

<div class="lesson-plan">

<h2>📚 KẾ HOẠCH BÀI DẠY AI</h2>

<div id="lessonPlanTable"></div>

</div>

` + storyboard;
  renderLessonPlanTable(lessonPlan);

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
// Copy toàn bộ Storyboard Prompt
if(getEl("copyPromptBtn")){
  getEl("copyPromptBtn").onclick = function(){

    const content = getEl("output").innerText;

    navigator.clipboard.writeText(content);

    alert("✅ Đã sao chép toàn bộ Prompt Storyboard!");

  };
 
// Xuất giáo án Word AI

if(getEl("exportWordBtn")){

  getEl("exportWordBtn").onclick = function(){

    const content = getEl("output").innerText;

    const blob = new Blob(
      [content],
      {type:"application/msword"}
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "Giao_an_AI.doc";

    a.click();

    URL.revokeObjectURL(url);

    alert("✅ Đã xuất giáo án Word AI!");

  };

} 
}
// Mở Canva với Prompt hình ảnh
if(getEl("canvaBtn")){
  getEl("canvaBtn").onclick = function(){

    const prompt = getEl("output").innerText;

    const url = "https://www.canva.com/ai-image-generator/";

    window.open(url, "_blank");

    alert("🎨 Đã mở Canva. Hãy dán Prompt Storyboard để tạo ảnh.");

  };
}
// Mở Kling AI với Prompt video
if(getEl("klingBtn")){
  getEl("klingBtn").onclick = function(){

    const prompt = getEl("output").innerText;

    const url = "https://klingai.com/";

    window.open(url, "_blank");

    alert("🎬 Đã mở Kling AI. Hãy dán Prompt video Storyboard.");

  };
}
// Mở CapCut với Prompt video
if(getEl("capcutBtn")){
  getEl("capcutBtn").onclick = function(){

    const prompt = getEl("output").innerText;

    const url = "https://www.capcut.com/";

    window.open(url, "_blank");

    alert("🎞 Đã mở CapCut. Hãy dùng Storyboard để dựng video.");

  };
}
// Xuất Word Storyboard
if(getEl("wordBtn")){
  getEl("wordBtn").onclick = function(){

    const content = getEl("output").innerText;

    const blob = new Blob(
      [
        "\ufeff" + content
      ],
      {
        type: "application/msword"
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "EDU-VIDEO-AI-Storyboard.doc";

    a.click();

    URL.revokeObjectURL(url);

    alert("📄 Đã xuất Word Storyboard!");

  };
}
