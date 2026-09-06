const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav");
const historyKey="anayaPathologyBookings";
const unreadKey="anayaPathologyHistoryUnread";
const historyNotification=document.getElementById("historyNotification");

menuBtn?.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const updateHistoryNotification=()=>historyNotification?.classList.toggle("visible",localStorage.getItem(unreadKey)==="true");
document.querySelector('#nav a[href="#bookingHistory"]')?.addEventListener("click",()=>{localStorage.setItem(unreadKey,"false");updateHistoryNotification();});
updateHistoryNotification();

const getBookings=()=>JSON.parse(localStorage.getItem(historyKey)||"[]");
const createBookingId=bookings=>{
  let id;
  do{id=`APL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;}
  while(bookings.some(b=>b.id===id));
  return id;
};
const escapeHTML=value=>String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
const renderHistory=()=>{
  const list=document.getElementById("historyList"); const bookings=getBookings();
  list.innerHTML=bookings.length?bookings.map(b=>`<article class="history-item"><div><strong>${escapeHTML(b.id)}</strong><span>${escapeHTML(b.name)} · ${escapeHTML(b.phone)}</span></div><div><strong>${escapeHTML(b.test)}</strong><span>${escapeHTML(b.collection)}</span></div><time>${escapeHTML(b.date)}</time></article>`).join(""):'<p class="history-empty">No bookings yet. Submitted bookings will appear here.</p>';
};
renderHistory();

document.querySelectorAll("[data-test]").forEach(btn=>btn.addEventListener("click",()=>{
  const select=document.getElementById("test"); select.value=btn.dataset.test;
  if(!select.value) select.value="Other / Need guidance";
  document.getElementById("booking").scrollIntoView({behavior:"smooth"});
}));

const cleanPhone=(input)=>input.value=input.value.replace(/\D/g,"").slice(0,10);
document.getElementById("phone")?.addEventListener("input",e=>cleanPhone(e.target));

document.getElementById("bookingForm")?.addEventListener("submit",e=>{
  e.preventDefault(); if(!e.target.checkValidity()){e.target.reportValidity();return;}
  const name=document.getElementById("name").value.trim(), phone=document.getElementById("phone").value.trim();
  const test=document.getElementById("test").value, collection=document.getElementById("collection").value;
  const bookings=getBookings(), booking={id:createBookingId(bookings),name,phone,test,collection,date:new Date().toLocaleString()};
  bookings.unshift(booking); localStorage.setItem(historyKey,JSON.stringify(bookings)); localStorage.setItem(unreadKey,"true"); updateHistoryNotification(); renderHistory();
  const note=document.getElementById("formNote"); note.style.color="#087b5b"; note.textContent="Booking saved successfully.";
  e.target.reset();
});

// document.getElementById("clearHistory")?.addEventListener("click",()=>{
//   localStorage.removeItem(historyKey); localStorage.setItem(unreadKey,"false"); updateHistoryNotification(); renderHistory();
// });
