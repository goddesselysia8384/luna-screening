(() => {
 const steps=[...document.querySelectorAll('.step')];
 const nav=[...document.querySelectorAll('.stepnav button')];
 const form=document.getElementById('screeningForm');
 const back=document.getElementById('backBtn');
 const next=document.getElementById('nextBtn');
 const submit=document.getElementById('submitBtn');
 const bar=document.getElementById('progressBar');
 const GOOGLE_FORM_ACTION='https://docs.google.com/forms/d/e/1FAIpQLSelRIpfl95b2Hc9iRyNzeH3yPyOKniPGPCP_wyOVsUi-24XTw/formResponse';
 let current=1;

 const fieldMap={
   name:'entry.2089585824', xhandle:'entry.1955330048', age:'entry.1316228930', av:'entry.431734988',
   experience:'entry.1082086601', interests:'entry.661402157', lookingfor:'entry.1889743532',
   hardlimits:'entry.331409833', softlimits:'entry.846213538', safeword:'entry.485287613', withdrawConsent:'entry.803275389',
   monthlyBudget:'entry.1316233340', singleBudget:'entry.1594172881', frequency:'entry.54995696', style:'entry.775834035',
   communication:'entry.1050580275', useful:'entry.471076883', respectBoundary:'entry.1796589710',
   agreeAge:'entry.341900721', agreeAV:'entry.1544679755', agreeConsent:'entry.792645044', agreeFunds:'entry.147665834',
   agreeLimits:'entry.2042026288', agreeTribute:'entry.498004103', agreeEnd:'entry.979947682'
 };

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
 function addValue(fd,key,value){ if(value!==undefined && value!==null && value!=='') fd.append(fieldMap[key],value); }
 function buildGooglePayload(){
   const fd=new FormData();
  fd.append('fvv','1');
   fd.append('pageHistory','0,1,2,3,4,5,6');
   ['name','xhandle','age','experience','lookingfor','hardlimits','softlimits','safeword','monthlyBudget','singleBudget','frequency','style','useful','respectBoundary'].forEach(key=>{
     const el=form.elements[key]; if(el) addValue(fd,key,el.value);
   });
   const av=form.querySelector('input[name="av"]:checked'); if(av) addValue(fd,'av',av.value);
   form.querySelectorAll('input[name="interests"]:checked').forEach(el=>addValue(fd,'interests',el.value));
   form.querySelectorAll('input[name="communication"]:checked').forEach(el=>addValue(fd,'communication',el.value));
   if(form.elements.withdrawConsent.checked) addValue(fd,'withdrawConsent','Yes');
   ['agreeAge','agreeAV','agreeConsent','agreeFunds','agreeLimits','agreeTribute','agreeEnd'].forEach(key=>{
     if(form.elements[key] && form.elements[key].checked) addValue(fd,key,'Yes');
   });
   return fd;
 }
 next.addEventListener('click',()=>{ if(validateCurrent()) show(current+1); });
 back.addEventListener('click',()=>show(current-1));
 nav.forEach((b,i)=>b.addEventListener('click',()=>{ if(i+1<=current || validateCurrent()) show(i+1); }));
 form.addEventListener('submit',async e=>{
   e.preventDefault();
   if(!validateCurrent()) return;
   submit.disabled=true; submit.textContent='SENDING…';
   try{
     await fetch(GOOGLE_FORM_ACTION,{method:'POST',mode:'no-cors',body:buildGooglePayload()});
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
