<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAQ Chatbot Assistant</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .chat-bubble {
            animation: fadeIn 0.3s ease-out;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex flex-col">
    <header class="bg-indigo-600 text-white py-4 shadow-md">
        <div class="container mx-auto px-4">
            <h1 class="text-2xl font-bold">FAQ Chatbot Assistant</h1>
            <p class="text-indigo-100">Get instant answers to your questions</p>
        </div>
    </header>

    <main class="flex-grow container mx-auto px-4 py-6 flex flex-col">
        <!-- Chat container -->
        <div class="bg-white rounded-lg shadow-md flex-grow flex flex-col overflow-hidden">
            <!-- Chat header -->
            <div class="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center">
                <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">AI</div>
                <div>
                    <h2 class="font-semibold">FAQ Helper</h2>
                    <p class="text-xs text-gray-500">Here to answer your questions</p>
                </div>
            </div>
            
            <!-- Messages area -->
            <div id="chat-messages" class="flex-grow p-4 overflow-y-auto">
                <!-- Initial bot message -->
                <div class="chat-bubble mb-4 flex justify-start">
                    <div class="bg-indigo-100 rounded-lg p-4 max-w-[80%]">
                        <p class="text-gray-800">Hi! I'm your FAQ assistant. Ask me anything about our product or services.</p>
                    </div>
                </div>
            </div>
            
            <!-- Input area -->
            <div class="p-4 border-t border-gray-200">
                <div class="flex">
                    <input 
                        type="text" 
                        id="user-input" 
                        placeholder="Type your question here..." 
                        class="flex-grow border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                    <button 
                        id="send-btn"
                        class="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
        
        <!-- FAQ suggestions -->
        <div class="mt-6">
            <h3 class="text-lg font-semibold mb-3">Common Questions:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button class="suggestion-btn bg-white border border-indigo-200 rounded-lg px-4 py-2 hover:bg-indigo-50 transition-colors">What are your business hours?</button>
                <button class="suggestion-btn bg-white border border-indigo-200 rounded-lg px-4 py-2 hover:bg-indigo-50 transition-colors">How do I return a product?</button>
                <button class="suggestion-btn bg-white border border-indigo-200 rounded-lg px-4 py-2 hover:bg-indigo-50 transition-colors">Where do you ship to?</button>
                <button class="suggestion-btn bg-white border border-indigo-200 rounded-lg px-4 py-2 hover:bg-indigo-50 transition-colors">What payment methods do you accept?</button>
            </div>
        </div>
    </main>

    <script>
        // FAQ Knowledge Base
        const faqs = [
            {
                question: "What are your business hours?",
                answer: "Our customer service is available Monday to Friday from 9:00 AM to 6:00 PM EST, and Saturdays from 10:00 AM to 4:00 PM EST. We're closed on Sundays and public holidays."
            },
            {
                question: "How do I return a product?",
                answer: "To return a product, please follow these steps: 1. Log in to your account. 2. Go to 'Orders' and select the item you want to return. 3. Click 'Return Item' and follow the instructions. You'll receive a return label to print and attach to your package. Returns must be initiated within 30 days of delivery."
            },
            {
                question: "Where do you ship to?",
                answer: "We currently ship to all 50 U.S. states plus Puerto Rico. We also ship to Canada, the UK, and Australia. International shipping rates vary by location. Note that delivery times may be longer for international orders."
            },
            {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. We also offer installment payments through Klarna and Afterpay."
            },
            {
                question: "How long does shipping take?",
                answer: "Standard shipping within the continental U.S. takes 3-5 business days. Express shipping takes 1-2 business days. International shipping typically takes 7-14 business days depending on customs processing."
            },
            {
                question: "Can I cancel my order?",
                answer: "You can cancel your order if it hasn't been processed for shipping yet. Please contact our customer service team immediately with your order number to request cancellation. Once an order is shipped, you'll need to return it following our return policy."
            },
            {
                question: "Do you offer discounts?",
                answer: "Yes! We offer first-time customer discounts of 15% off your first order when you sign up for our newsletter. We also run seasonal promotions and holiday sales. Check our website banner and social media for current offers."
            },
            {
                question: "How can I track my order?",
                answer: "After your order ships, you'll receive a confirmation email with tracking information. You can also log in to your account and check the order status page, which will show your tracking details and estimated delivery date."
            }
        ];

        // Simple text preprocessing function
        function preprocessText(text) {
            return text
                .toLowerCase()
                .replace(/[^\w\s]|_/g, "") // Remove punctuation
                .replace(/\s+/g, " ")      // Normalize whitespace
                .trim();
        }

        // Calculate similarity between two strings using Jaccard index
        function calculateSimilarity(a, b) {
            a = preprocessText(a);
            b = preprocessText(b);
            
            const wordsA = a.split(' ');
            const wordsB = b.split(' ');
            
            const intersection = wordsA.filter(word => wordsB.includes(word)).length;
            const union = wordsA.length + wordsB.length - intersection;
            
            return union === 0 ? 0 : intersection / union;
        }

        // Find best matching FAQ
        function findBestMatch(userQuestion) {
            let bestMatch = null;
            let highestScore = 0;
            
            for (const faq of faqs) {
                const score = calculateSimilarity(userQuestion, faq.question);
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = faq;
                }
            }
            
            // Require minimum similarity score
            return highestScore > 0.3 ? bestMatch : {
                question: userQuestion,
                answer: "I couldn't find a good answer to that question. Maybe try rephrasing it or asking something different?"
            };
        }

        // DOM elements
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');

        // Add message to chat
        function addMessage(content, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-bubble mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`;
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = isUser 
                ? 'bg-indigo-600 text-white rounded-lg p-4 max-w-[80%]'
                : 'bg-indigo-100 rounded-lg p-4 max-w-[80%]';
            bubbleDiv.textContent = content;
            
            messageDiv.appendChild(bubbleDiv);
            chatMessages.appendChild(messageDiv);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Handle user message
        function handleUserMessage() {
            const question = userInput.value.trim();
            if (!question) return;
            
            addMessage(question, true);
            userInput.value = '';
            
            // Simulate typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'chat-bubble mb-4 flex justify-start';
            typingIndicator.innerHTML = '<div class="bg-indigo-100 rounded-lg p-4 max-w-[80%]">...</div>';
            chatMessages.appendChild(typingIndicator);
            
            // Small delay for realistic interaction
            setTimeout(() => {
                // Remove typing indicator
                chatMessages.removeChild(typingIndicator);
                
                // Get and show response
                const faq = findBestMatch(question);
                addMessage(faq.answer);
            }, 800);
        }

        // Event listeners
        sendBtn.addEventListener('click', handleUserMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserMessage();
        });
        
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                userInput.value = btn.textContent;
                userInput.focus();
            });
        });
    </script>
</body>
</html>

