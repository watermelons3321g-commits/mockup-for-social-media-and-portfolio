// Init on load
window.addEventListener('load',()=>{const u=JSON.parse(localStorage.getItem('users'))||[];if(!u.length){u.push({username:'admin',password:'admin',email:'admin@gamingcommunity.com',createdAt:new Date().toISOString()});localStorage.setItem('users',JSON.stringify(u));}const cur=localStorage.getItem('currentUser'),page=window.location.pathname;if(page.includes('index.html')&&cur)return void(window.location.href='main.html');if(!page.includes('index.html')&&!cur)return void(window.location.href='index.html');if(cur)document.querySelectorAll('#currentUser').forEach(el=>el.textContent=cur);initToasts();});

// Toast notifications
function initToasts(){if(document.getElementById('toastContainer'))return;const d=document.createElement('div');d.id='toastContainer';d.style.cssText='position:fixed;top:20px;right:20px;z-index:9999;';document.body.appendChild(d);}
function showToast(msg,type='info',duration=3000){const c=document.getElementById('toastContainer')||initToasts();const t=document.createElement('div');const bg=type==='success'?'#4ade80':type==='error'?'#f87171':'#00d4ff';t.style.cssText='background:'+bg+';color:#fff;padding:1rem 1.5rem;border-radius:8px;margin-bottom:0.5rem;box-shadow:0 4px 12px rgba(0,0,0,0.3);animation:slideIn 0.3s ease;';t.textContent=msg;(document.getElementById('toastContainer')||initToasts()).appendChild(t);setTimeout(()=>t.remove(),duration);}

// Modal system
function openModal(title,content,actions=[]){const modal=document.createElement('div');modal.className='modal';modal.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:10000;';const box=document.createElement('div');box.style.cssText='background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:2rem;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;';let html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;"><h2 style="margin:0;color:#00d4ff;">'+title+'</h2><button onclick="this.closest(\'.modal\').remove()" style="background:0;border:0;color:#999;font-size:1.5rem;cursor:pointer;">&times;</button></div><div style="color:#fff;margin-bottom:2rem;">'+content+'</div><div style="display:flex;gap:1rem;'+(actions.length?'':'justify-content:flex-end;')+'">';box.innerHTML=html;actions.forEach(a=>{const btn=document.createElement('button');btn.textContent=a.label;btn.style.cssText='padding:0.7rem 1.5rem;background:'+(a.type==='primary'?'#00d4ff':'#2a2a2a')+';color:'+(a.type==='primary'?'#000':'#fff')+';border:0;border-radius:6px;cursor:pointer;font-weight:600;';btn.onclick=()=>{a.action();modal.remove();};box.querySelector('div:last-child').appendChild(btn);});if(!actions.length){const btn=document.createElement('button');btn.textContent='Close';btn.style.cssText='padding:0.7rem 1.5rem;background:#00d4ff;color:#000;border:0;border-radius:6px;cursor:pointer;font-weight:600;';btn.onclick=()=>modal.remove();box.querySelector('div:last-child').appendChild(btn);}modal.appendChild(box);modal.onclick=(e)=>{if(e.target===modal)modal.remove();};document.body.appendChild(modal);}

// Favorites system
function toggleFavorite(id,type){const favs=JSON.parse(localStorage.getItem('favorites'))||{};const key=`${type}_${id}`;favs[key]=!favs[key];localStorage.setItem('favorites',JSON.stringify(favs));const btn=document.querySelector(`[data-favor-id="${id}"]`);if(btn){btn.innerHTML=favs[key]?'<i class="fas fa-heart" style="color:#ff006e;"></i>':'<i class="fas fa-heart" style="color:#999;"></i>';showToast(favs[key]?'Added to favorites!':'Removed from favorites!','success',2000);}return favs[key];}
function isFavorited(id,type){const favs=JSON.parse(localStorage.getItem('favorites'))||{};return favs[`${type}_${id}`]||false;}

// Like system
function toggleLike(id,type){const likes=JSON.parse(localStorage.getItem('likes'))||{};const key=`${type}_${id}`;likes[key]=(likes[key]||0)+(document.querySelector(`[data-like-count="${id}"]`).dataset.liked==='true'?-1:1);document.querySelector(`[data-like-count="${id}"]`).dataset.liked=document.querySelector(`[data-like-count="${id}"]`).dataset.liked==='true'?'false':'true';document.querySelector(`[data-like-count="${id}"]`).textContent=likes[key]||0;localStorage.setItem('likes',JSON.stringify(likes));showToast('Thanks for the like!','success',1500);}

// Toggle auth tabs
function switchTab(t){['loginForm','registerForm'].forEach(id=>document.getElementById(id).classList.remove('active'));['loginError','registerError'].forEach(id=>document.getElementById(id).textContent='');document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));const form=t==='login'?'loginForm':'registerForm';document.getElementById(form).classList.add('active');document.querySelectorAll('.tab-btn')[t==='login'?0:1].classList.add('active');}

// User login
function login(e){e.preventDefault();const u=document.getElementById('loginUsername').value,p=document.getElementById('loginPassword').value,err=document.getElementById('loginError'),users=JSON.parse(localStorage.getItem('users'))||[],user=users.find(x=>x.username===u&&x.password===p);if(user){localStorage.setItem('currentUser',u);err.textContent='';showToast('Welcome back!','success');setTimeout(()=>window.location.href='main.html',800);}else{err.textContent='Invalid credentials';err.style.color='#ff006e';showToast('Login failed','error');}}

// User register
function register(e){e.preventDefault();const u=document.getElementById('regUsername').value,em=document.getElementById('regEmail').value,p=document.getElementById('regPassword').value,pc=document.getElementById('regPasswordConfirm').value,err=document.getElementById('registerError');if(u.length<3){err.textContent='Username min 3 chars';return;}if(p.length<4){err.textContent='Password min 4 chars';return;}if(p!==pc){err.textContent='Passwords dont match';return;}let users=JSON.parse(localStorage.getItem('users'))||[];if(users.find(x=>x.username===u)){err.textContent='User already exists';return;}users.push({username:u,email:em,password:p,createdAt:new Date().toISOString()});localStorage.setItem('users',JSON.stringify(users));localStorage.setItem('currentUser',u);err.textContent='Done!';err.style.color='#00d4ff';showToast('Account created!','success');setTimeout(()=>window.location.href='main.html',1500);}

// Logout
function logout(){openModal('Logout','Are you sure?',[{label:'Yes',type:'primary',action:()=>{localStorage.removeItem('currentUser');showToast('Goodbye!','success');setTimeout(()=>window.location.href='index.html',800);}},{label:'No',type:'secondary',action:()=>{}}]);}

// Toggle sidebar
function toggleMenu(){document.querySelector('.sidebar').classList.toggle('active');}

// Close menu on click outside
document.addEventListener('click',e=>{const s=document.querySelector('.sidebar'),m=document.querySelector('.menu-toggle');if(s&&m&&!s.contains(e.target)&&!m.contains(e.target))s.classList.remove('active');});

// Check session
function checkSession(){const user=localStorage.getItem('currentUser');return user||(window.location.href='index.html',false);}

// Get all users
function getAllUsers(){return JSON.parse(localStorage.getItem('users'))||[];}

// Get current user
function getCurrentUser(){const u=localStorage.getItem('currentUser');return u?getAllUsers().find(x=>x.username===u):null;}

// View profile modal
function viewProfile(name){const user={name:name,rating:Math.floor(Math.random()*3000)+1000,wins:Math.floor(Math.random()*500),losses:Math.floor(Math.random()*300),games:['Valorant','CS2','LoL'][Math.floor(Math.random()*3)]};openModal(`Profile: ${user.name}`,`<div style="text-align:center;"><p style="font-size:1.2rem;margin:1rem 0;">Rating: <strong style="color:#00d4ff;">${user.rating}</strong></p><p>Main Game: <strong>${user.games}</strong></p><p>Wins: <strong style="color:#4ade80;">${user.wins}</strong> | Losses: <strong style="color:#f87171;">${user.losses}</strong></p><p>Win Rate: <strong>${((user.wins/(user.wins+user.losses))*100).toFixed(1)}%</strong></p></div>`,[{label:'Add Friend',type:'primary',action:()=>showToast(`Friend request sent to ${name}!`,'success')},{label:'Close',type:'secondary',action:()=>{}}]);}

// Subscribe to channel
function subscribe(channelName){const subs=JSON.parse(localStorage.getItem('subscriptions'))||[];if(!subs.includes(channelName)){subs.push(channelName);localStorage.setItem('subscriptions',JSON.stringify(subs));showToast(`Subscribed to ${channelName}!`,'success');}else{const idx=subs.indexOf(channelName);subs.splice(idx,1);localStorage.setItem('subscriptions',JSON.stringify(subs));showToast(`Unsubscribed from ${channelName}`,'info');}}

// Report content
function reportContent(id,type){openModal('Report Content',`<div><p>Why are you reporting this?</p><select id="reportReason" style="width:100%;padding:0.7rem;background:#0a0a0a;border:1px solid #2a2a2a;color:#fff;border-radius:6px;margin:1rem 0;"><option>Inappropriate content</option><option>Spam</option><option>Offensive language</option><option>Other</option></select><textarea placeholder="Additional details..." style="width:100%;height:80px;padding:0.7rem;background:#0a0a0a;border:1px solid #2a2a2a;color:#fff;border-radius:6px;resize:none;"></textarea></div>`,[{label:'Submit Report',type:'primary',action:()=>{showToast('Thank you for reporting. Our team will review this.','success');}},{label:'Cancel',type:'secondary',action:()=>{}}]);}

// Share content
function shareContent(title,url){if(navigator.share){navigator.share({title:title,url:url||window.location.href}).catch(e=>console.log());}else{openModal('Share',`<div style="text-align:center;"><p>Share this link:</p><input type="text" value="${url||window.location.href}" readonly style="width:100%;padding:0.7rem;background:#0a0a0a;border:1px solid #2a2a2a;color:#fff;border-radius:6px;margin:1rem 0;" id="shareLink"><button onclick="document.getElementById('shareLink').select();document.execCommand('copy');showToast('Copied!','success');" style="background:#00d4ff;color:#000;border:0;padding:0.7rem 1.5rem;border-radius:6px;cursor:pointer;font-weight:600;width:100;">Copy Link</button></div>`,[{label:'Close',type:'secondary',action:()=>{}}]);}}

// Animate elements on scroll
function observeElements(){const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';obs.unobserve(e.target);}});},{threshold:0.1});document.querySelectorAll('.news-card, .game-card, .friend-card, .tournament-card, .gallery-item').forEach(e=>{e.style.opacity='0';e.style.transform='translateY(20px)';e.style.transition='all 0.6s ease';obs.observe(e);});}
document.addEventListener('DOMContentLoaded',observeElements);
