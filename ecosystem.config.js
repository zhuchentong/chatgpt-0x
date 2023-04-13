module.exports = {
  deploy: {
    production: {
      'user': 'root', // ssh 登陆服务器用户名
      'host': '121.37.181.45', // ssh 地址服务器domain/IP
      'ref': 'origin/master', // Git远程/分支
      'repo': 'git@github.com:zhuchentong/chatgpt-0x.git', // git地址使用ssh地址
      'path': '/data/chatgpt', // 项目存放服务器文件路径
      'ssh_options': 'StrictHostKeyChecking=no',
      'pre-deploy': 'git fetch --all',
      'post-deploy':
        'docker build -t chatgpt-0x . && docker rm -f chatgpt-0x && docker run -d -p 8040:4000 --name chatgpt-0x -v /data/chatgpt/.env.production:/app/apps/server/.env.production.local chatgpt-0x', // 部署后的动作
    },
  },
}
