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
  const subject = getEl("subject").value, grade = getEl("grade").value, topic = getEl("topic").value, purpose = getEl("purpose").value, duration = getEl("duration").value, ratio = getEl("ratio").value, style = getEl("style").value, voice = getEl("voice").value, extra = getEl("extra").value;
  const prompt = "Create a " + duration + " educational video about " + topic + ", grade " + grade + ", style " + style + ". Purpose: " + purpose + ". Voice: " + voice + ". Ratio: " + ratio + ". " + extra;
  getEl("output").innerHTML = "<h2>Kịch bản tổng nạp vào AI</h2><div class='prompt'>" + prompt + "</div>";
  getEl("output").classList.remove("hidden");
  if (sb && currentUser) sb.from("videos").insert({ title: topic, subject, grade, topic, level: "Giáo dục", description: purpose, prompt, duration, scene_count: 5, status: "DRAFT" }).then(() => loadVideos());
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
