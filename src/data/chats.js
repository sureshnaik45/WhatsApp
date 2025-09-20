export const chatsData = [
  // These chats have a category and will appear in the 'Categories' tab
  { id: 1, name: 'Mom', message: "Don't forget dinner tonight!", time: '10:30 PM', unread: 2, avatar: '👩‍💼', isGroup: false, isMuted: false, category: 'family' },
  { id: 2, name: 'Boss - Mike', message: 'Can we discuss the project timeline?', time: '8:15 PM', unread: 1, avatar: '👨‍💼', isGroup: false, isMuted: false, category: 'work' },
  { id: 4, name: 'Family Group', message: 'Dad: Don\'t forget Sunday lunch', time: '6:30 PM', unread: 5, avatar: '👨‍👩‍👧‍👦', isGroup: true, isMuted: false, category: 'family' },
  { id: 6, name: 'Work Team', message: 'Sarah: Meeting at 2 PM today', time: '4:45 PM', unread: 3, avatar: '💼', isGroup: true, isMuted: true, category: 'work' },
  { id: 8, name: 'College Friends', message: "Alex: Who's joining the reunion?", time: 'Yesterday', unread: 12, avatar: '🎓', isGroup: true, isMuted: false, category: 'college' },
  { id: 9, name: 'Dad', message: 'Proud of you kiddo! 🎉', time: 'Yesterday', unread: 0, avatar: '👨‍🦳', isGroup: false, isMuted: false, category: 'family' },
  { id: 10, name: 'Team Lead Sarah', message: 'Great work on the presentation!', time: '2 days ago', unread: 0, avatar: '👩‍💼', isGroup: false, isMuted: false, category: 'work' },
  { id: 12, name: 'Uncle John', message: 'Family reunion planning', time: '3 days ago', unread: 0, avatar: '👨‍🦲', isGroup: false, isMuted: false, category: 'family' },
  { id: 13, name: 'Dr. Evans', message: 'Your appointment is confirmed for tomorrow.', time: '4:10 PM', unread: 1, avatar: '👨‍⚕️', isGroup: false, isMuted: false, category: 'work' },
  { id: 18, name: 'Cousin Emily', message: 'Sent you the photos from the wedding!', time: '12:45 PM', unread: 1, avatar: '👱‍♀️', isGroup: false, isMuted: false, category: 'family' },
  { id: 19, name: 'Project Phoenix', message: 'Mike: Please review the latest wireframes.', time: '11:00 AM', unread: 2, avatar: '🚀', isGroup: true, isMuted: false, category: 'work' },
  { id: 20, name: 'Gaming Squad', message: 'Tom: Ready for tonight\'s raid?', time: '9:15 PM', unread: 8, avatar: '🎮', isGroup: true, isMuted: false, category: 'college' },
  { id: 21, name: 'Fitness Group', message: 'Lisa: Morning workout at 6 AM', time: '7:30 PM', unread: 4, avatar: '💪', isGroup: true, isMuted: false, category: 'college' },
  { id: 22, name: 'Book Club', message: 'Emma: This month\'s book suggestions', time: '5:20 PM', unread: 2, avatar: '📚', isGroup: true, isMuted: false, category: 'college' },
  { id: 23, name: 'Weekend Plans', message: 'Sam: Beach trip this Saturday?', time: '3:45 PM', unread: 6, avatar: '🏖️', isGroup: true, isMuted: false, category: 'family' },
  { id: 24, name: 'Study Group', message: 'Alex: Assignment due tomorrow!', time: '11:30 AM', unread: 15, avatar: '📖', isGroup: true, isMuted: false, category: 'college' },

  // Individual chats without categories
  { id: 3, name: 'Alex Johnson', message: 'Are you free this weekend?', time: '7:20 PM', unread: 1, avatar: '🧑‍💻', isGroup: false, isMuted: false },
  { id: 5, name: 'Emma Wilson', message: 'Thanks for the coffee! ☕', time: '5:15 PM', unread: 1, avatar: '👩‍🎨', isGroup: false, isMuted: false },
  { id: 7, name: 'Tom Parker', message: "Let's catch up soon!", time: 'Yesterday', unread: 0, avatar: '👨‍🎓', isGroup: false, isMuted: false },
  { id: 11, name: 'Lisa Chen', message: 'Happy birthday! 🎂', time: '2 days ago', unread: 0, avatar: '👩‍🔬', isGroup: false, isMuted: false },
  { id: 15, name: 'Maria Garcia', message: 'Just saw your post, amazing!', time: '3:05 PM', unread: 0, avatar: '💃', isGroup: false, isMuted: false },
  { id: 17, name: 'Gym Buddy Dave', message: 'See you at 6 PM?', time: '1:00 PM', unread: 0, avatar: '💪', isGroup: false, isMuted: false },
  { id: 25, name: 'Old Roommate - Sam', message: 'Long time no see! How have you been?', time: '4 days ago', unread: 1, avatar: '😎', isGroup: false, isMuted: false },
  { id: 26, name: 'Neighbor Kate', message: 'Can you water my plants?', time: '2 hours ago', unread: 0, avatar: '👩‍🌾', isGroup: false, isMuted: false },
  { id: 27, name: 'Delivery Guy', message: 'Package delivered!', time: '1 hour ago', unread: 1, avatar: '🚚', isGroup: false, isMuted: false }
];

// Group messages data
export const groupMessages = {
  4: [ // Family Group
    { id: 1, sender: 'Mom', avatar: '👩‍💼', message: "Don't forget Sunday lunch everyone!", time: '2:30 PM', fromSelf: false },
    { id: 2, sender: 'Dad', avatar: '👨‍🦳', message: 'I\'ll bring the dessert', time: '2:32 PM', fromSelf: false },
    { id: 3, sender: 'Sister', avatar: '👩‍🎓', message: 'What time should I come?', time: '2:35 PM', fromSelf: false },
    { id: 4, sender: 'You', avatar: '👤', message: 'Around 1 PM works for me', time: '2:37 PM', fromSelf: true },
    { id: 5, sender: 'Uncle John', avatar: '👨‍🦲', message: 'See you all there! 🍽️', time: '2:40 PM', fromSelf: false }
  ],
  6: [ // Work Team
    { id: 1, sender: 'Sarah', avatar: '👩‍💼', message: 'Meeting at 2 PM today', time: '1:15 PM', fromSelf: false },
    { id: 2, sender: 'Mike', avatar: '👨‍💼', message: 'I\'ll prepare the slides', time: '1:18 PM', fromSelf: false },
    { id: 3, sender: 'You', avatar: '👤', message: 'Should I bring the quarterly reports?', time: '1:20 PM', fromSelf: true },
    { id: 4, sender: 'Sarah', avatar: '👩‍💼', message: 'Yes, that would be perfect', time: '1:22 PM', fromSelf: false },
    { id: 5, sender: 'David', avatar: '👨‍💻', message: 'I\'ll join from home', time: '1:25 PM', fromSelf: false }
  ],
  8: [ // College Friends
    { id: 1, sender: 'Alex', avatar: '🧑‍💻', message: "Who's joining the reunion?", time: '3:00 PM', fromSelf: false },
    { id: 2, sender: 'Emma', avatar: '👩‍🎨', message: 'Count me in! 🎉', time: '3:05 PM', fromSelf: false },
    { id: 3, sender: 'Tom', avatar: '👨‍🎓', message: 'I can\'t make it this time', time: '3:08 PM', fromSelf: false },
    { id: 4, sender: 'You', avatar: '👤', message: 'I\'ll definitely be there', time: '3:10 PM', fromSelf: true },
    { id: 5, sender: 'Lisa', avatar: '👩‍🔬', message: 'Where are we meeting?', time: '3:12 PM', fromSelf: false }
  ],
  19: [ // Project Phoenix
    { id: 1, sender: 'Mike', avatar: '👨‍💼', message: 'Please review the latest wireframes', time: '10:30 AM', fromSelf: false },
    { id: 2, sender: 'Designer Jane', avatar: '👩‍🎨', message: 'Updated based on feedback', time: '10:45 AM', fromSelf: false },
    { id: 3, sender: 'You', avatar: '👤', message: 'Looks great! Small suggestion on the header', time: '11:00 AM', fromSelf: true },
    { id: 4, sender: 'Mike', avatar: '👨‍💼', message: 'What\'s the suggestion?', time: '11:02 AM', fromSelf: false },
    { id: 5, sender: 'You', avatar: '👤', message: 'Maybe increase the font size slightly', time: '11:05 AM', fromSelf: true }
  ],
  20: [ // Gaming Squad
    { id: 1, sender: 'Tom', avatar: '👨‍🎓', message: 'Ready for tonight\'s raid?', time: '8:00 PM', fromSelf: false },
    { id: 2, sender: 'Alex', avatar: '🧑‍💻', message: 'What time are we starting?', time: '8:05 PM', fromSelf: false },
    { id: 3, sender: 'You', avatar: '👤', message: '9 PM works for me', time: '8:08 PM', fromSelf: true },
    { id: 4, sender: 'Sam', avatar: '😎', message: 'I\'ll be a bit late', time: '8:10 PM', fromSelf: false },
    { id: 5, sender: 'Tom', avatar: '👨‍🎓', message: 'No problem, we\'ll wait', time: '8:12 PM', fromSelf: false }
  ],
  23: [ // Weekend Plans
    { id: 1, sender: 'Sam', avatar: '😎', message: 'Beach trip this Saturday?', time: '2:00 PM', fromSelf: false },
    { id: 2, sender: 'Emily', avatar: '👱‍♀️', message: 'Sounds fun! What time?', time: '2:15 PM', fromSelf: false },
    { id: 3, sender: 'You', avatar: '👤', message: 'I can drive if needed', time: '2:20 PM', fromSelf: true },
    { id: 4, sender: 'Dave', avatar: '💪', message: 'I\'ll bring the volleyball', time: '2:25 PM', fromSelf: false },
    { id: 5, sender: 'Sam', avatar: '😎', message: 'Perfect! Meet at 10 AM?', time: '2:30 PM', fromSelf: false }
  ]
};