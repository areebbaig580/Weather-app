const activeTemp = document.querySelectorAll('.toggle-temp');
const activeDay = document.querySelectorAll('.toggle-el');


activeDay.forEach(box =>
    box.addEventListener('click', (evt) => {
        document.querySelectorAll('.toggle-el').forEach(t => t.classList.remove('active-day'));
        evt.target.classList.add('active-day');
    })
);
activeTemp.forEach(box =>
    box.addEventListener('click', (evt) => {
        document.querySelectorAll('.toggle-temp').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.togle-temp-el1').forEach(t => t.classList.remove('active-el'));
        document.querySelectorAll('.togle-temp-el2').forEach(t => t.classList.remove('active-el'));
        box.classList.add('active');
        box.firstElementChild.classList.add('active-el');
        box.lastElementChild.classList.add('active-el');
    })
);

