const menuBtn=document.getElementById("menuBtn"),nav=document.getElementById("nav");
menuBtn?.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

document.querySelectorAll("[data-test]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.getElementById("test").value = btn.dataset.test;
    document.getElementById("booking").scrollIntoView({behavior:"smooth"});
  });
});

document.getElementById("bookingForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("name").value.trim();
  const test=document.getElementById("test").value;
  const collection=document.getElementById("collection").value;
  const note=document.getElementById("formNote");
  note.textContent=`Thanks, ${name}! Your ${test} request for ${collection.toLowerCase()} has been received. This demo does not send data to a server yet.`;
  note.style.color="#087b5b";
  e.target.reset();
});
