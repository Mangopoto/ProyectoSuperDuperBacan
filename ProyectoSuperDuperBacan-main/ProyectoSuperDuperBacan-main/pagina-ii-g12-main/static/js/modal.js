const modal = document.querySelector('#modal');
const open_modal = document.querySelector('#accessibility');
const close_modal = document.querySelector('#close_modal');

open_modal.addEventListener('click', ()=>{modal.showModal();});
close_modal.addEventListener('click', ()=>{modal.close();});