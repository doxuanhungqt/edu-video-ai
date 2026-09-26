const C = window.EDU_CONFIG || {}; let sb = null, currentUser = null;
const getEl = function(id) { return document.getElementById(id); };
if (C.SUPABASE_URL && C.SUPABASE_PUBLISHABLE_KEY) sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_PUBLISHABLE_KEY);

function msg(el, text, type) { if (el) { el.textContent = text; el.className = "msg " + (type || ""); } }
function renderLessonPlanTable(plan) {

  const box = document.getElementById("lessonPlanTable");

  if (!box) return;

 const parts = plan.split("----------------");

const activities = parts.slice(1);
  
  const lessonInfo = parts[0];

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
  
<div class="lesson-info">
${lessonInfo.replace(/\n/g,"<br>")}
</div>

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
  let subjectInstruction = "";
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
  let topicKnowledge = "";
  if(subject.includes("Toán")){

if(topic.includes("Phân số")){

topicKnowledge =
"Kiến thức trọng tâm: Khái niệm phân số, tử số, mẫu số, phân số bằng nhau, so sánh phân số, quy đồng mẫu số và vận dụng giải bài toán.";

}

}

  subjectInstruction = `

YÊU CẦU ĐẶC THÙ MÔN HỌC:

Môn học: ${subject}
Lớp: ${grade}
Chủ đề: ${topic}

Nội dung kế hoạch bài dạy phải thể hiện đúng đặc trưng môn học:

- Giáo dục thể chất:
Nội dung phải thể hiện rõ kỹ năng vận động của bài học.
Cần có:
+ Kỹ thuật hoặc động tác trọng tâm.
+ Tư thế chuẩn bị và cách thực hiện.
+ Các bước luyện tập.
+ Lỗi thường gặp và cách sửa.
+ Tiêu chí đánh giá kỹ năng vận động.

Ví dụ:
Chạy: xuất phát, chạy lao, phối hợp tay chân, duy trì tốc độ, về đích.
Bóng đá: dẫn bóng, chuyền bóng, sút bóng.
Cầu lông: phát cầu, đánh cầu, di chuyển.
- Toán học:
Nội dung phải thể hiện:
+ Khái niệm, tính chất hoặc quy tắc toán học.
+ Quy trình tư duy giải quyết vấn đề.
+ Ví dụ minh họa.
+ Bài tập vận dụng.
+ Cách học sinh trình bày và giải thích cách làm.

- Tiếng Anh:
Nội dung phải thể hiện:
+ Từ vựng trọng tâm của chủ đề.
+ Mẫu câu/cấu trúc ngữ pháp.
+ Luyện nghe, nói, đọc, viết.
+ Hoạt động giao tiếp thực tế.
+ Sản phẩm ngôn ngữ của học sinh.
- Tiếng Việt/Ngữ văn:
Nội dung phải thể hiện:
+ Đọc hiểu văn bản, xác định nội dung và nghệ thuật.
+ Phân tích nhân vật, hình ảnh, chi tiết tiêu biểu.
+ Rèn kỹ năng viết và tạo lập văn bản.
+ Phát triển năng lực giao tiếp, cảm thụ và trình bày ý kiến.
+ Sản phẩm có thể là bài viết, đoạn văn, câu trả lời hoặc phần trình bày của học sinh.

- Khoa học/KHTN:
Nội dung phải thể hiện:
+ Quan sát sự vật, hiện tượng và đặt câu hỏi khoa học.
+ Thực hiện thí nghiệm hoặc hoạt động khám phá.
+ Phân tích kết quả, giải thích nguyên nhân và rút ra kết luận.
+ Vận dụng kiến thức vào thực tiễn.
+ Sản phẩm có thể là báo cáo thí nghiệm, phiếu học tập hoặc kết quả khám phá.

- Vật lí:
Nội dung phải thể hiện:
+ Khái niệm, định luật, công thức vật lí.
+ Giải thích hiện tượng bằng cơ sở khoa học.
+ Phân tích mối quan hệ giữa các đại lượng.
+ Hướng dẫn giải bài tập và vận dụng công thức.
+ Có thể sử dụng thí nghiệm, mô hình hoặc thiết bị đo.
+ Sản phẩm có thể là bài giải, báo cáo thí nghiệm, sơ đồ hoặc mô hình.

- Hóa học:
Nội dung phải thể hiện:
+ Khái niệm, tính chất của chất và phản ứng hóa học.
+ Viết phương trình hóa học và giải thích quá trình biến đổi.
+ Thực hành thí nghiệm, quan sát hiện tượng và rút ra kết luận.
+ Kỹ năng tính toán hóa học và vận dụng thực tế.
+ Đảm bảo an toàn khi sử dụng hóa chất.
+ Sản phẩm có thể là phương trình, bài tập, báo cáo thí nghiệm hoặc sơ đồ phản ứng.

- Sinh học:
Nội dung phải thể hiện:
+ Cấu tạo, chức năng và quá trình sống của sinh vật.
+ Quan sát, phân tích hình ảnh, sơ đồ hoặc mẫu vật.
+ Giải thích các hiện tượng sinh học.
+ Liên hệ sức khỏe, môi trường và đời sống.
+ Sản phẩm có thể là sơ đồ tư duy, báo cáo quan sát, bài trình bày hoặc mô hình.

- Lịch sử/Địa lí:
Nội dung phải thể hiện:
+ Xác định sự kiện, nhân vật, thời gian và không gian lịch sử.
+ Khai thác bản đồ, lược đồ, tư liệu và nguồn thông tin.
+ Phân tích nguyên nhân, diễn biến, ý nghĩa của sự kiện.
+ Nhận xét, so sánh và liên hệ thực tế.
+ Sản phẩm có thể là sơ đồ tư duy, bảng tổng hợp, bài trình bày hoặc phiếu học tập.

- Lịch sử:
Nội dung phải thể hiện:
+ Sự kiện, nhân vật, thời gian và bối cảnh lịch sử.
+ Phân tích nguyên nhân, diễn biến, kết quả và ý nghĩa.
+ Khai thác tư liệu lịch sử.
+ Rèn kỹ năng nhận xét, đánh giá và liên hệ.
+ Sản phẩm có thể là sơ đồ thời gian, bảng tổng hợp, bài trình bày.

- Địa lí:
Nội dung phải thể hiện:
+ Khai thác bản đồ, biểu đồ, số liệu địa lí.
+ Phân tích đặc điểm tự nhiên, kinh tế, xã hội.
+ Giải thích mối quan hệ giữa con người và môi trường.
+ Rèn kỹ năng nhận xét, so sánh và phân tích dữ liệu.
+ Sản phẩm có thể là biểu đồ, bản đồ tư duy, báo cáo hoặc bài trình bày.

- Công nghệ:
Nội dung phải thể hiện:
+ Kiến thức về quy trình công nghệ, kỹ thuật hoặc sản phẩm công nghệ.
+ Các bước thực hiện, thao tác và kỹ năng thực hành.
+ Sử dụng dụng cụ, vật liệu hoặc thiết bị phù hợp.
+ Đảm bảo an toàn trong quá trình thực hiện.
+ Sản phẩm có thể là mô hình, bản thiết kế, sản phẩm thực hành hoặc báo cáo.

- Giáo dục công dân (THCS):
Nội dung phải thể hiện:
+ Chuẩn mực đạo đức, quyền và nghĩa vụ của công dân.
+ Tình huống thực tế, cách xử lý và vận dụng trong cuộc sống.
+ Phân tích hành vi đúng, sai và đưa ra quan điểm.
+ Rèn luyện phẩm chất, thái độ và trách nhiệm.
+ Sản phẩm có thể là ý kiến thảo luận, bài trình bày hoặc xử lý tình huống.

- Giáo dục kinh tế và pháp luật (THPT):
Nội dung phải thể hiện:
+ Kiến thức về kinh tế, pháp luật và đời sống xã hội.
+ Phân tích các khái niệm, nguyên tắc kinh tế và quy định pháp luật.
+ Xử lý tình huống thực tiễn liên quan đến quyền, nghĩa vụ và trách nhiệm công dân.
+ Rèn năng lực tư duy kinh tế, hiểu biết pháp luật và ra quyết định có trách nhiệm.
+ Liên hệ các vấn đề thực tế trong gia đình, nhà trường và xã hội.
+ Sản phẩm có thể là bài trình bày, sơ đồ tư duy, phân tích tình huống hoặc bài viết lập luận.

- Hoạt động trải nghiệm, hướng nghiệp:
Nội dung phải thể hiện:
+ Hoạt động trải nghiệm thực tế, khám phá bản thân và môi trường xung quanh.
+ Kỹ năng giao tiếp, hợp tác, giải quyết vấn đề.
+ Hoạt động cá nhân, nhóm và nhiệm vụ trải nghiệm.
+ Liên hệ thực tế và định hướng phát triển bản thân.
+ Sản phẩm có thể là nhật ký trải nghiệm, kế hoạch cá nhân, poster hoặc bài trình bày.

- Âm nhạc:
Nội dung phải thể hiện:
+ Kiến thức âm nhạc, giai điệu, nhịp điệu và tiết tấu.
+ Kỹ năng hát, nghe nhạc, vận động theo nhạc hoặc biểu diễn.
+ Cảm nhận và thể hiện cảm xúc âm nhạc.
+ Hoạt động luyện tập cá nhân và nhóm.
+ Sản phẩm có thể là bài hát, phần biểu diễn hoặc nhận xét cảm nhận âm nhạc.

- Mĩ thuật:
Nội dung phải thể hiện:
+ Kiến thức về màu sắc, hình khối, bố cục và yếu tố tạo hình.
+ Quy trình sáng tạo sản phẩm nghệ thuật.
+ Kỹ năng quan sát, thực hành và trình bày ý tưởng.
+ Khuyến khích sự sáng tạo và thẩm mỹ.
+ Sản phẩm có thể là tranh, mô hình, thiết kế hoặc bài giới thiệu sản phẩm.

- Tin học:
Nội dung phải thể hiện:
+ Kiến thức về công nghệ thông tin và kỹ năng số.
+ Quy trình sử dụng phần mềm, thiết bị hoặc công cụ số.
+ Thực hành tạo sản phẩm số.
+ Đảm bảo an toàn, đạo đức trong môi trường số.
+ Sản phẩm có thể là tệp tin, bài trình chiếu, chương trình hoặc sản phẩm số.
Không tạo nội dung chung chung.
Phải thể hiện kiến thức, kỹ năng đặc thù của bài học.
`;

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
  lessonPlan = `
MÔN HỌC:
${subject}

LỚP:
${grade}

CHỦ ĐỀ:
${topic}

YÊU CẦU ĐẶC THÙ MÔN HỌC:
${subjectInstruction}
KIẾN THỨC TRỌNG TÂM:
${topicKnowledge}

`;
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
`Giáo viên giới thiệu chủ đề ${topic} trong môn ${subject}, hướng dẫn học sinh chuẩn bị kiến thức và kỹ năng cần thiết cho bài học.`;

studentActivity =
`Học sinh lớp ${grade} quan sát, trao đổi hiểu biết ban đầu về ${topic} và tham gia hoạt động khởi động phù hợp với môn ${subject}.`;
learningProduct =
`Ý kiến ban đầu, câu trả lời hoặc sản phẩm chuẩn bị liên quan đến chủ đề ${topic}.`;

    assessmentCriteria =
`Học sinh thể hiện sự hiểu biết ban đầu về ${topic}, tích cực tham gia hoạt động và chia sẻ ý kiến.`;
assessmentQuestion =
`Em biết gì về ${topic} trong môn ${subject}?`;
teacherFeedback =
`Giáo viên nhận xét ý kiến của học sinh về ${topic}, bổ sung kiến thức ban đầu và dẫn dắt vào bài học.`;
    learningObjective =
`Học sinh lớp ${grade} bước đầu tiếp cận chủ đề ${topic} trong môn ${subject}, tạo hứng thú và chuẩn bị cho hoạt động học tập.`;

    }
    
else if(role.includes("Khám phá")) {

  sceneImageStyle =
  "Students discovering new knowledge, teacher explaining, learning materials.";

 scenePurpose =
"Hình thành kiến thức mới, giúp học sinh khám phá nội dung bài học.";

  learningObjective =
`Học sinh lớp ${grade} khám phá và hiểu các kiến thức trọng tâm về ${topic} trong môn ${subject}, giải thích được nội dung cốt lõi của bài học.`;
 teacherActivity =
`Giáo viên hướng dẫn học sinh tìm hiểu ${topic}, sử dụng phương pháp phù hợp của môn ${subject}, đặt câu hỏi và hỗ trợ học sinh hình thành kiến thức mới.`;

studentActivity =
`Học sinh lớp ${grade} quan sát, thảo luận, tìm hiểu nội dung ${topic} và hình thành kiến thức, kỹ năng của môn ${subject}.`;
learningProduct =
`Câu trả lời, ghi chép hoặc sản phẩm học tập thể hiện sự hiểu biết về ${topic}.`;

  assessmentCriteria =
`Học sinh hiểu được nội dung ${topic}, trình bày ý kiến, giải thích và vận dụng kiến thức của môn ${subject}.`;

assessmentQuestion =
`Em hãy trình bày những kiến thức quan trọng về ${topic} mà em vừa khám phá.`;
teacherFeedback =
`Giáo viên nhận xét, bổ sung kiến thức về ${topic} và hướng dẫn học sinh hoàn thiện hiểu biết trong môn ${subject}.`;
}

else if(role.includes("Minh họa")) {

  sceneImageStyle =
  "Detailed demonstration, close-up learning activity, clear visual explanation.";

  scenePurpose =
"Làm rõ kiến thức bằng hình ảnh, ví dụ và hướng dẫn trực quan.";

  learningObjective =
`Học sinh lớp ${grade} phân tích, quan sát và hiểu rõ cách thực hiện ${topic} thông qua ví dụ minh họa trong môn ${subject}.`;
teacherActivity =
`Giáo viên minh họa nội dung ${topic}, hướng dẫn kỹ thuật, thao tác hoặc cách giải quyết nhiệm vụ phù hợp với môn ${subject}.`;

studentActivity =
`Học sinh lớp ${grade} quan sát, phân tích ví dụ về ${topic}, trao đổi và rút ra kiến thức, kỹ năng cần thiết.`;

learningProduct =
`Phiếu học tập, phần trình bày hoặc sản phẩm thể hiện sự hiểu biết về ${topic}.`;
  
  assessmentCriteria =
`Học sinh giải thích được ví dụ về ${topic}, thực hiện đúng yêu cầu và liên hệ kiến thức trong môn ${subject}.`;
assessmentQuestion =
`Ví dụ minh họa giúp em hiểu thêm điều gì về ${topic}?`;

teacherFeedback =
`Giáo viên nhận xét cách hiểu của học sinh về ${topic}, giải thích thêm và điều chỉnh những điểm chưa chính xác.`;
}

else if(role.includes("Thực hành")) {

  sceneImageStyle =
  "Students practicing, group activity, active learning environment.";

  scenePurpose =
"Tổ chức hoạt động luyện tập, trải nghiệm và vận dụng.";

  learningObjective =
`Học sinh lớp ${grade} vận dụng kiến thức về ${topic} trong môn ${subject}, thực hiện đúng yêu cầu kỹ thuật, rèn luyện kỹ năng và hoàn thành nhiệm vụ học tập.`;
teacherActivity =
`Giáo viên tổ chức hoạt động thực hành về ${topic}, hướng dẫn kỹ thuật, quan sát quá trình luyện tập và hỗ trợ học sinh điều chỉnh sai sót.`;

studentActivity =
`Học sinh lớp ${grade} thực hành ${topic}, phối hợp với bạn học, vận dụng kiến thức và hoàn thiện kỹ năng của môn ${subject}.`;
learningProduct =
`Kết quả thực hành, phần trình bày hoặc sản phẩm thể hiện kỹ năng về ${topic}.`;

  assessmentCriteria =
`Học sinh thực hiện được yêu cầu của ${topic}, vận dụng đúng kiến thức và cải thiện kỹ năng trong môn ${subject}.`;
assessmentQuestion =
`Em hãy trình bày cách em thực hiện và những kỹ thuật quan trọng khi học ${topic}.`;

teacherFeedback =
`Giáo viên nhận xét quá trình thực hiện ${topic}, hướng dẫn học sinh sửa lỗi kỹ thuật và khuyến khích vận dụng vào thực tế.`;
}

else if(role.includes("Tổng kết")) {

  sceneImageStyle =
  "Students sharing results, happy ending, lesson conclusion.";

  scenePurpose =
"Củng cố kiến thức, ghi nhớ nội dung trọng tâm.";

  learningObjective =
`Học sinh lớp ${grade} hệ thống lại kiến thức về ${topic} trong môn ${subject}, tự đánh giá kết quả học tập và ghi nhớ những nội dung quan trọng.`;
teacherActivity =
`Giáo viên nhận xét kết quả học tập về ${topic}, củng cố kiến thức trọng tâm và hướng dẫn học sinh vận dụng trong thực tế.`;

studentActivity =
`Học sinh lớp ${grade} chia sẻ kết quả thực hiện ${topic}, tự đánh giá quá trình học tập và ghi nhớ kiến thức của môn ${subject}.`;
learningProduct =
`Phần trình bày, kết quả học tập hoặc nội dung ghi nhớ về ${topic} cuối bài học.`;

  assessmentCriteria =
`Học sinh tổng hợp được kiến thức về ${topic}, đánh giá được kết quả học tập và vận dụng kiến thức của môn ${subject}.`;

assessmentQuestion =
`Em hãy nêu lại những kiến thức quan trọng nhất về ${topic}.`;
teacherFeedback =
`Giáo viên nhận xét, đánh giá kết quả học tập về ${topic} và định hướng học sinh vận dụng kiến thức vào thực tế.`;
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
  "Subject instruction: " + subjectInstruction + ". " +
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
  
getEl("output").insertAdjacentHTML("beforeend",`

<div class="lesson-plan">

<h2>📚 KẾ HOẠCH BÀI DẠY AI</h2>

<div id="lessonPlanTable"></div>

</div>
<div class="export-area">

<button id="exportWordBtn" class="secondary">
📄 Xuất giáo án Word AI
</button>

</div>
`);

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
  }
// Xuất giáo án Word AI
  
document.addEventListener("click", function(e){

   if(e.target.closest("#exportWordBtn")){
 console.log("EXPORT WORD CLICK");

const tableHTML = document.querySelector("#lessonPlanTable table");

const rows = [];

if(tableHTML){

    tableHTML.querySelectorAll("tr").forEach(tr => {

        const cells = [];

        tr.querySelectorAll("th, td").forEach(td => {
            cells.push(td.innerText.trim());
        });

        rows.push(cells);

    });

}


const table = new docx.Table({

    width: {
        size: 100,
        type: docx.WidthType.PERCENTAGE
    },

    borders: {
        top: { style: "single", size: 1, color: "000000" },
        bottom: { style: "single", size: 1, color: "000000" },
        left: { style: "single", size: 1, color: "000000" },
        right: { style: "single", size: 1, color: "000000" },
        insideHorizontal: { style: "single", size: 1, color: "000000" },
        insideVertical: { style: "single", size: 1, color: "000000" }
    },

    rows: rows.map(row =>

        new docx.TableRow({

            children: row.map(cell =>

                new docx.TableCell({

                    children: [

                        new docx.Paragraph({

                            children: [

                                new docx.TextRun({

                                    text: cell,

                                    font: "Times New Roman",

                                    size: 22

                                })

                            ]

                        })

                    ]

                })

            )

        })

    )

});




const doc = new docx.Document({
    sections: [
        {
            children: [

                new docx.Paragraph({
                    alignment: docx.AlignmentType.CENTER,
                    children: [
                        new docx.TextRun({
                            text: "STORYBOARD AI",
                            bold: true,
                            font: "Times New Roman",
                            size: 32
                        })
                    ]
                }),

                new docx.Paragraph({
                    children: [
                        new docx.TextRun({
                            text: "",
                            font: "Times New Roman",
                            size: 24
                        })
                    ]
                }),

                new docx.Paragraph({
                    alignment: docx.AlignmentType.CENTER,
                    children: [
                        new docx.TextRun({
                            text: "KẾ HOẠCH BÀI DẠY AI",
                            bold: true,
                            font: "Times New Roman",
                            size: 28
                        })
                    ]
                }),

                table
            ]
        }
    ]
});


docx.Packer.toBlob(doc).then(blob => {

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "Giao_an_AI.docx";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

});

        alert("✅ Đã xuất giáo án Word AI!");
    }

});
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
// Xuất giáo án Word AI
if(getEl("exportWordBtn")){

    getEl("exportWordBtn").onclick = function(){

      console.log("EXPORT WORD CLICK");

        const content = getEl("output").innerText;

        const blob = new Blob(
            [content],
            {type:"application/msword"}
        );

        const url = URL.createObjectURL(blob);

       const a = document.createElement("a");

a.style.display = "none";
a.href = url;
a.download = "Giao_an_AI.doc";

document.body.appendChild(a);

a.click();

document.body.removeChild(a);

URL.revokeObjectURL(url);

alert("✅ Đã xuất giáo án Word AI!");
    };
}

