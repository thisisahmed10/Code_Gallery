// start page

//about page

const cards = document.querySelectorAll('.card-hover-effect');

cards.forEach(card => {
card.addEventListener('mouseenter', () => {
    card.style.backgroundColor = '#ffffff'; // ← غيري اللون هنا لو حابة
});

card.addEventListener('mouseleave', () => {
    card.style.backgroundColor = '#f5f5f5'; // ← اللون الأصلي
});
});

//conact us 
document.querySelector("form").addEventListener("submit", function (e) {
e.preventDefault(); // منع الإرسال التلقائي

// جمع البيانات من الفورم
const name = document.querySelector('input[placeholder="Name"]').value;
const email = document.querySelector('input[placeholder="Email"]').value;
const password = document.querySelector('input[placeholder="Password"]').value;
const message = document.querySelector('textarea[placeholder="Message for me"]').value;

// تكوين كائن يحتوي البيانات
const contactData = {
    name: name,
    email: email,
    password: password,
    message: message,
    time: new Date().toLocaleString()
};

// حفظ الكائن في localStorage
localStorage.setItem("contactForm", JSON.stringify(contactData));

// اختيارية: مسح الفورم بعد الحفظ
this.reset();

// تنبيه للمستخدم
alert("تم حفظ البيانات في Local Storage بنجاح!");
const saved = JSON.parse(localStorage.getItem("contactForm"));
console.log(saved);
});