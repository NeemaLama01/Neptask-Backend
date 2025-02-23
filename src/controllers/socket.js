// Connect to the Socket.io server
const socket = io();

// Get the elements for the chat UI
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messageContainer = document.getElementById("messageContainer");

// Join a conversation (this can be triggered when the user joins a room)
const conversationId = "some-conversation-id"; // Replace with actual conversation ID

socket.emit("joinConversation", conversationId);

// Listen for incoming messages
socket.on("newMessage", (message) => {
  displayMessage(message);
});

// Function to display new message
function displayMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.textContent = `${message.sender}: ${message.text}`;
  messageContainer.appendChild(messageElement);
}

// Send a new message when the button is clicked
sendButton.addEventListener("click", () => {
  const messageText = messageInput.value;
  
  if (messageText.trim()) {
    const message = {
      text: messageText,
      conversationId: conversationId,
      sender: "User", // Replace with actual sender's name or ID
    };
    
    socket.emit("sendMessage", message); // Send the message to the server
    messageInput.value = ""; // Clear the input field
  }
});
