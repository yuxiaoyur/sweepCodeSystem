import Mock from 'mockjs'

// 登录
export function login () {
  return {
    // isOpen: false,
    url: '/login',
    type: 'post',
    data: {
      'username': '1',
      'password': 1,
      'expire': Mock.Random.natural(60 * 60 * 1, 60 * 60 * 12),
      'token': Mock.Random.string('abcdefghijklmnopqrstuvwxyz0123456789', 32)
    }
  }
}

// 退出
export function logout () {
  return {
    // isOpen: false,
    url: '/logout',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}
