// 模拟用户数据库
// 在实际应用中，这应该存储在数据库中，密码应该加密
export const MOCK_USERS = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    password: 'password123',
  },
  {
    id: 2,
    name: '测试用户',
    email: 'test@example.com',
    password: 'test123',
  },
];

// 添加新用户
export function addUser(name: string, email: string, password: string) {
  const newUser = {
    id: MOCK_USERS.length + 1,
    name,
    email,
    password,
  };
  
  MOCK_USERS.push(newUser);
  return newUser;
}

// 查找用户
export function findUser(email: string, password: string) {
  return MOCK_USERS.find(u => u.email === email && u.password === password);
}

// 检查邮箱是否已存在
export function isEmailTaken(email: string) {
  return MOCK_USERS.some(user => user.email === email);
} 