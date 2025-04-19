 // Select the button element
 const button = document.getElementById('myButton');

 // Add an event listener to the button
 button.addEventListener('click', function() {
     // Perform an action when the button is clicked
     const message = document.getElementById('message');
     message.textContent = 'Button was clicked!';
 });