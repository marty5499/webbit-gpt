/**
 * 待擴充 enums
 */

// for test
// export enum MQTT_ACTORS {
//   ENGLISH = 'eng',
// }

export enum LOCALE {
  EN = 'en',
  ZH_HANT = 'zh-hant',
}

export enum GENERATE_QUESTION_TYPE {
  CHOICE = 'choice',
  QA = 'Q&A',
}

// TODO: 後續需要根據正式機/測試機進行調整
export enum MQTT_TOPIC {
  KN = 'kn@chat-staging', // 思維工具
  CODE = 'code@chat-staging', // 小書僮
}

export enum ACTOR_TYPE {
  TUTORIAL = 'tutorial',
  QUIZ = 'quiz',
  SHEET = 'sheet',
  WEBBIT = 'webbit',
  PYTHON = 'python',
}

export enum ROUTER_NAME {
  HOME = 'home',
  ACTOR_CREATION = 'ActorCreation',
  ACTOR_EDIT = 'ActorEdit',
  STUDY_BUDDY_QA = 'StudyBuddyQA',
  STUDY_BUDDY_QUESTION = 'StudyBuddyQuestion',
}

// export enum MARKDOWN_TYPE {
//   NONE = 'none',
//   MARKDOWN = 'markdown',
//   EXAM = 'exam',
//   QUESTION = 'question',
//   QUESTION_V2 = 'question_v2',
// }

// export enum ANSWER_RECORD_FROM {
//   QUESTION = 'question',
//   EXAM = 'exam-paper',
// }

// export enum ANSWER_RECORD_ERROR_TYPE {
//   ERROR = 'AssertionError',
//   TIMEOUT = 'TimeOutError',
//   OUT_OF_MEMORY = 'OutOfMemoryError',
// }

// export enum RESULT_VIEW_MODE {
//   LOCAL = 'local',
//   SERVER = 'server',
// }
