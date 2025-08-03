// Page loads and main content is immediately visible
window.addEventListener("load", function () {
  // Main content is now visible by default, no loader needed
});

function showHome() {
  document.querySelector('.background').style.display = 'block';
  document.getElementById('content').innerHTML = '';
}

function showPreview() {
  document.querySelector('.background').style.display = 'none';
  document.getElementById('content').innerHTML = '<iframe src="../Preview/feed.html" width="100%" height="700px" frameborder="0"></iframe>';
}

function showAbout() {
  document.querySelector('.background').style.display = 'none';
  document.getElementById('content').innerHTML = '<iframe src="../about/about.html" width="100%" height="700px" frameborder="0"></iframe>';
}

function showContact() {
  document.querySelector('.background').style.display = 'none';
  document.getElementById('content').innerHTML = '<iframe src="../about/about.html#contact" width="100%" height="700px" frameborder="0"></iframe>';
}