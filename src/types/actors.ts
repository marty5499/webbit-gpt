/**
 * 添加自定義的 typescript type
 * ServiceXXXX：更新後端資料使用的格式
 */

// export interface MyClass {
//   id: number;
//   createdAt: number;
//   modifiedAt: number;
//   createdBy: number;
//   name: string;
// }

// export interface MyClasses {
//   totalPages: number;
//   list: MyClass[];
// }

// export interface ServiceMyClass
//   extends Omit<MyClass, 'id' | 'createdAt' | 'modifiedAt' | 'createdBy'> {}

export interface Actor {
  createdBy: number;
  description: string;
  id: number;
  image: string;
  name: string;
  temperature: number;
  url: string;
}

export interface Actors {
  lastIndex: number;
  list: Actor[];
}
