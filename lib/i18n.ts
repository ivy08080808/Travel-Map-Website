export type Language = 'en' | 'zh';

export interface Translations {
  // Navigation
  nav: {
    experience: string;
    travelogues: string;
    dailyLife: string;
    readingNotes: string;
    dailyShare: string;
    backToTravelogues: string;
  };
  
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    description: string;
    description2: string;
    description3: string;
    description4: string;
  };
  
  // Pages
  pages: {
    travelogues: {
      title: string;
      description: string;
    };
    dailyLife: {
      title: string;
      description: string;
      readingNotes: string;
      readingNotesDesc: string;
      dailyShare: string;
      dailyShareDesc: string;
    };
    experience: {
      title: string;
      description: string;
    };
  };
  
  // Footer
  footer: {
    copyright: string;
  };
  
  // Common
  common: {
    allRightsReserved: string;
  };
  
  // Comments
  comments: {
    title: string;
    writeComment: string;
    loading: string;
    noComments: string;
    replyingTo: string;
    nameOptional: string;
    emailOptional: string;
    message: string;
    submit: string;
    submitting: string;
    update: string;
    updating: string;
    cancel: string;
    fillMessage: string;
    submissionFailed: string;
    unableToIdentify: string;
    failedToDelete: string;
    failedToUpdate: string;
    delete: string;
    edit: string;
    reply: string;
    deleting: string;
    hide: string;
    show: string;
    replyCount: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      experience: 'Experience',
      travelogues: 'Travelogues',
      dailyLife: 'Daily Life',
      readingNotes: 'Reading Notes',
      dailyShare: 'Daily Share',
      backToTravelogues: '← Back to Travelogues',
    },
    hero: {
      title: 'Chinghua Ivy Lu',
      subtitle: 'About me',
      description: "Hello, I'm Chinghua Ivy Lu, currently a student in the Department of Information Management at National Taiwan University.",
      description2: "This website documents my learning, daily life, and explorations across different stages of my journey, including academic experiences, exchange programs and internships, as well as observations and reflections gathered through travel. I see it as a space to organize my thoughts and look back on my personal growth.",
      description3: "Many of the entries here are simply snapshots of my thoughts and feelings at a particular moment. They may not always be polished or complete, but they are genuine reflections of how I felt at that time—kept here so those moments don't quietly fade away.",
      description4: "If any of these stories resonate with you or spark your interest, feel free to leave a comment and share your thoughts.",
    },
    pages: {
      travelogues: {
        title: 'Travelogues',
        description: "Read about my adventures and journeys around the world. Each travelogue is a story about people, places, and experiences I've had.",
      },
      dailyLife: {
        title: 'Daily Life',
        description: 'Stories and reflections from my everyday life and insights from books and articles.',
        readingNotes: 'Reading Notes',
        readingNotesDesc: 'Insights and reflections from books I\'ve read.',
        dailyShare: 'Daily Share',
        dailyShareDesc: 'Stories and thoughts from my everyday life.',
      },
      experience: {
        title: 'Experience',
        description: 'My work experiences, internships, and volunteer activities.',
      },
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Chinghua Ivy Lu. All rights reserved.`,
    },
    common: {
      allRightsReserved: 'All rights reserved.',
    },
    comments: {
      title: 'Comments',
      writeComment: 'Write a Comment',
      loading: 'Loading...',
      noComments: 'No comments yet. Be the first to comment!',
      replyingTo: 'Replying to',
      nameOptional: 'Name (Optional)',
      emailOptional: 'Email (Optional)',
      message: 'Message *',
      submit: 'Submit Comment',
      submitting: 'Submitting...',
      update: 'Update Comment',
      updating: 'Updating...',
      cancel: 'Cancel',
      fillMessage: 'Please fill in the message',
      submissionFailed: 'Submission failed, please try again',
      unableToIdentify: 'Unable to identify your session',
      failedToDelete: 'Failed to delete',
      failedToUpdate: 'Failed to update comment',
      delete: 'Delete',
      edit: 'Edit',
      reply: 'Reply',
      deleting: 'Deleting...',
      hide: 'Hide',
      show: 'Show',
      replyCount: 'reply',
    },
  },
  zh: {
    nav: {
      experience: '經歷',
      travelogues: '遊記',
      dailyLife: '日常',
      readingNotes: '讀書心得',
      dailyShare: '日常分享',
      backToTravelogues: '← 返回遊記',
    },
    hero: {
      title: '呂卿華',
      subtitle: '關於我',
      description: '大家好～我是呂卿華，目前就讀於國立臺灣大學資訊管理學系',
      description2: '這個網站記錄了我在不同階段的學習、生活與探索歷程，包含學校經驗、交換與實習，以及旅行途中所累積的觀察與反思。我將它視為一個整理思緒、回顧成長。',
      description3: '這裡記錄的多是一些即時的心情與零散的想法，不一定成熟或完整，卻是真實存在於那個時間點的感受，只希望不要讓那些感受悄悄消失。',
      description4: '如果這些分享對你有所啟發，或引起任何共鳴，歡迎在下方留言交流。',
    },
    pages: {
      travelogues: {
        title: '遊記',
        description: '閱讀我在世界各地的冒險和旅程。每篇遊記都是關於我遇到的人、地方和經歷的故事。',
      },
      dailyLife: {
        title: '日常',
        description: '來自我的日常生活以及從書籍和文章中獲得的見解的故事和反思。',
        readingNotes: '讀書心得',
        readingNotesDesc: '從我讀過的書籍中獲得的見解和反思。',
        dailyShare: '日常分享',
        dailyShareDesc: '來自我日常生活的故事和想法。',
      },
      experience: {
        title: '經歷',
        description: '我的工作經驗、實習和志工活動。',
      },
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} 呂卿華。版權所有。`,
    },
    common: {
      allRightsReserved: '版權所有。',
    },
    comments: {
      title: '留言',
      writeComment: '寫留言',
      loading: '載入中...',
      noComments: '還沒有留言。成為第一個留言的人吧！',
      replyingTo: '回覆給',
      nameOptional: '姓名（選填）',
      emailOptional: '電子郵件（選填）',
      message: '留言內容 *',
      submit: '提交留言',
      submitting: '提交中...',
      update: '更新留言',
      updating: '更新中...',
      cancel: '取消',
      fillMessage: '請填寫留言內容',
      submissionFailed: '提交失敗，請重試',
      unableToIdentify: '無法識別您的會話',
      failedToDelete: '刪除失敗',
      failedToUpdate: '更新留言失敗',
      delete: '刪除',
      edit: '編輯',
      reply: '回覆',
      deleting: '刪除中...',
      hide: '隱藏',
      show: '顯示',
      replyCount: '則回覆',
    },
  },
};

