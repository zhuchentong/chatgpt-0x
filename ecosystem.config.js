module.exports = {
  deploy: {
    production: {
      'user': 'root', // ssh 登陆服务器用户名
      'host': '121.5.165.149', // ssh 地址服务器domain/IP
      'ref': 'origin/master', // Git远程/分支
      'repo': 'git@github.com:gopowerteam-mall/mall-service.git', // git地址使用ssh地址
      'path': '/home/apps/mall-service', // 项目存放服务器文件路径
      'ssh_options': 'StrictHostKeyChecking=no',
      'pre-deploy': 'git fetch --all',
      'post-deploy':
        'docker build -t chatgpt-0x . && docker rm -f chatgpt-0x && docker run -d -p 4000:4000 chatgpt-0x', // 部署后的动作
    },
  },
}
