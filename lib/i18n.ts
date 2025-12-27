export type Language = 'en' | 'zh';

export interface Translations {
  // Navigation
  nav: {
    travelogues: string;
    map: string;
    dailyLife: string;
    backToTravelogues: string;
  };
  
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    description: string;
    description2: string;
    description3: string;
  };
  
  // Pages
  pages: {
    travelogues: {
      title: string;
      description: string;
    };
    map: {
      title: string;
      description: string;
      countries: string;
      countriesDesc: string;
      km: string;
      kmDesc: string;
      peaks: string;
      peaksDesc: string;
    };
    dailyLife: {
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
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      travelogues: 'Travelogues',
      map: 'Map',
      dailyLife: 'Daily Life',
      backToTravelogues: '← Back to Travelogues',
    },
    hero: {
      title: 'Chinghua Ivy Lu',
      subtitle: "Chinghua Ivy Lu's Adventurous Journeys",
      description: "Hello! I'm currently a student at National Taiwan University. I have a deep love for traveling and observing the world around me. Every journey brings new places, new perspectives, and, most importantly, wonderful people I'm grateful to meet along the way.",
      description2: "This blog is my way of collecting and preserving the things I care about—travel moments, everyday thoughts, and reflections from my daily life. In the Daily Life section, I write about my university experiences as well as insights from books and articles I've read.",
      description3: "Feel free to leave a comment and share your thoughts. I'd love for this space to be one where we can exchange ideas and experiences together.",
    },
    pages: {
      travelogues: {
        title: 'Travelogues',
        description: "Read about my adventures and journeys around the world. Each travelogue is a story about people, places, and experiences I've had.",
      },
      map: {
        title: 'Travel Map',
        description: "Explore the map of my journeys and places I've visited during my adventures.",
        countries: '83+ Countries',
        countriesDesc: 'Visited around the world',
        km: '15,938+ km',
        kmDesc: 'Hiked in the mountains',
        peaks: '448+ Peaks',
        peaksDesc: 'Mountain summits climbed',
      },
      dailyLife: {
        title: 'Daily Life',
        description: 'Stories and reflections from my everyday life, university experiences, and insights from books and articles.',
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
      travelogues: '遊記',
      map: '地圖',
      dailyLife: '日常',
      backToTravelogues: '← 返回遊記',
    },
    hero: {
      title: '呂卿華',
      subtitle: '呂卿華的冒險旅程',
      description: '你好！我目前是國立台灣大學的學生。我熱愛旅行和觀察周圍的世界。每一次旅程都帶來新的地方、新的視角，最重要的是，我很感激能在路上遇到的精彩人們。',
      description2: '這個部落格是我收集和保存我關心的事物的一種方式——旅行時刻、日常想法，以及我日常生活中的反思。在「日常」區塊中，我寫下我的大學經歷以及從我讀過的書籍和文章中獲得的見解。',
      description3: '歡迎留言並分享你的想法。我希望這個空間能成為我們一起交流想法和經驗的地方。',
    },
    pages: {
      travelogues: {
        title: '遊記',
        description: '閱讀我在世界各地的冒險和旅程。每篇遊記都是關於我遇到的人、地方和經歷的故事。',
      },
      map: {
        title: '旅行地圖',
        description: '探索我的旅程地圖以及我在冒險中訪問過的地方。',
        countries: '83+ 個國家',
        countriesDesc: '世界各地訪問過',
        km: '15,938+ 公里',
        kmDesc: '在山中徒步',
        peaks: '448+ 座山峰',
        peaksDesc: '攀登的山峰',
      },
      dailyLife: {
        title: '日常',
        description: '來自我的日常生活、大學經歷以及從書籍和文章中獲得的見解的故事和反思。',
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

