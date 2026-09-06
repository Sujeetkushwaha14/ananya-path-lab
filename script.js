const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav");
const historyKey="ananyaPathlabBookings";
const unreadKey="ananyaPathlabHistoryUnread";
const historyLink=document.getElementById("historyLink");
const historyNotification=document.getElementById("historyNotification");
menuBtn?.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const updateHistoryNotification=()=>historyNotification.classList.toggle("visible",localStorage.getItem(unreadKey)==="true");
historyLink.addEventListener("click",()=>{
  localStorage.setItem(unreadKey,"false");
  updateHistoryNotification();
});
updateHistoryNotification();

const getBookings=()=>JSON.parse(localStorage.getItem(historyKey)||"[]");
const createBookingId=bookings=>{
  let bookingId;
  do {
    bookingId=`APL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
  } while(bookings.some(booking=>booking.id===bookingId));
  return bookingId;
};
const escapeHTML=value=>String(value).replace(/[&<>'"]/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[character]));
const phoneInput=document.getElementById("phone");
phoneInput.addEventListener("input",()=>{
  phoneInput.value=phoneInput.value.replace(/\D/g,"").slice(0,10);
});
const renderHistory=()=>{
  const historyList=document.getElementById("historyList");
  const bookings=getBookings();
  historyList.innerHTML=bookings.length ? bookings.map(booking=>`
    <article class="history-item">
      <div><strong>${escapeHTML(booking.id||"Booking ID unavailable")}</strong><span>${escapeHTML(booking.name)} · ${escapeHTML(booking.phone)}</span></div>
      <div><strong>${escapeHTML(booking.test)}</strong><span>${escapeHTML(booking.collection)}</span></div>
      <time>${escapeHTML(booking.date)}</time>
    </article>`).join("") : '<p class="history-empty">No bookings yet. Submitted bookings will appear here.</p>';
};

renderHistory();

document.querySelectorAll("[data-test]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.getElementById("test").value = btn.dataset.test;
    document.getElementById("booking").scrollIntoView({behavior:"smooth"});
  });
});

document.getElementById("bookingForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!e.target.checkValidity()){
    e.target.reportValidity();
    return;
  }
  const name=document.getElementById("name").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const test=document.getElementById("test").value;
  const collection=document.getElementById("collection").value;
  const bookings=getBookings();
  bookings.unshift({id:createBookingId(bookings),name,phone,test,collection,date:new Date().toLocaleString()});
  localStorage.setItem(historyKey,JSON.stringify(bookings));
  localStorage.setItem(unreadKey,"true");
  updateHistoryNotification();
  const note=document.getElementById("formNote");
  note.textContent=`Thanks, ${name}! Your ${test} request for ${collection.toLowerCase()} has been received. This demo does not send data to a server yet.`;
  note.style.color="#087b5b";
  renderHistory();
  e.target.reset();
});

// document.getElementById("clearHistory").addEventListener("click",()=>{
//   localStorage.removeItem(historyKey);
//   renderHistory();
// });
