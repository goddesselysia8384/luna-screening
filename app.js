(() => {
 const steps=[...document.querySelectorAll('.step')];
 const nav=[...document.querySelectorAll('.stepnav button')];
 const form=document.getElementById('screeningForm');
 const back=document.getElementById('backBtn');
 const next=document.getElementById('nextBtn');
 const submit=document.getElementById('submitBtn');
 const bar=document.getElementById('progressBar');
 const FORM_ENDPOINT='https://script.google.com/macros/s/AKfycbzsjAvWrWcl_G3DNcbPeR1JKgvT99ajOBIcbKuZqvMDc8VNrk3K8gEmA26ikS9nKTH7/exec';
 let current=1;

 function show(n){
   current=Math.max(1,Math.min(7,n));
   steps.forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===current));
   nav.forEach((b,i)=>b.classList.toggle('active',i+1===current));
   back.style.visibility=current===1?'hidden':'visible';
   next.style.display=current===7?'none':'inline-flex';
   submit.style.display=current===7?'inline-flex':'none';
   bar.style.width=`${current/7*100}%`;
   window.scrollTo({top:0,behavior:'smooth'});
 }
 function validateCurrent(){
   const step=steps.find(s=>Number(s.dataset.step)===current);
   const req=[...step.querySelectorAll('[required]')];
   for(const el of req){
     if((el.type==='radio' || el.type==='checkbox')){
       if(el.type==='radio'){
         const group=[...step.querySelectorAll(`input[name="${el.name}"]`)];
         if(!group.some(x=>x.checked)){ el.focus(); alert('Please complete the required question.'); return false; }
       } else if(!el.checked){ el.focus(); alert('Please confirm the required item.'); return false; }
     } else if(!el.value.trim()){ el.focus(); alert('Please complete the required field.'); return false; }
   }
   if(current===1){
     const av=form.querySelector('input[name="av"]:checked');
     if(av && av.value==='No'){ alert('Age verification is required to continue this application.'); return false; }
   }
   return true;
 }
 next.addEventListener('click',()=>{ if(validateCurrent()) show(current+1); });
 back.addEventListener('click',()=>show(current-1));
 nav.forEach((b,i)=>b.addEventListener('click',()=>{ if(i+1<=current || validateCurrent()) show(i+1); }));
 form.addEventListener('submit',async e=>{
   e.preventDefault();
   if(!validateCurrent()) return;
   submit.disabled=true; submit.textContent='SENDING…';
   try{
     if(FORM_ENDPOINT==='PASTE_FORMSPREE_ENDPOINT_HERE'){
       alert('Submission receiver has not been connected yet.');
       submit.disabled=false; submit.textContent='SUBMIT TO LUNA 💋';
       return;
     }
     const fd=new FormData(form);
     // Make checkbox-only consent values human-readable in the inbox/dashboard.
     ['withdrawConsent','agreeAge','agreeAV','agreeConsent','agreeFunds','agreeLimits','agreeTribute','agreeEnd'].forEach(key=>{
       if(form.elements[key] && form.elements[key].checked) fd.set(key,'Yes');
     });
     fd.set('_subject', 'New Luna Wallet Application');
     const res=await fetch(FORM_ENDPOINT,{
       method:'POST',
       body:fd,
       headers:{'Accept':'application/json'}
     });
     if(!res.ok) throw new Error('Submission failed');
     form.style.display='none';
     document.getElementById('success').classList.add('show');
     bar.style.width='100%';
     window.scrollTo({top:0,behavior:'smooth'});
   } catch(err){
     alert('The application could not be sent. Please check your connection and try again.');
     submit.disabled=false; submit.textContent='SUBMIT TO LUNA 💋';
   }
 });
 show(1);
})();

