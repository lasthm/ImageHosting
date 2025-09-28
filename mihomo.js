// https://mihomo.party/docs/guide/override/javascript
function main(config) {
  // Ensure basic structure exists (though assignments below might overwrite)
  if (!config['proxy-groups']) {
    config['proxy-groups'] = [];
  }
  if (!config['rule-providers']) {
    config['rule-providers'] = {};
  }
  if (!config['rules']) {
    config['rules'] = [];
  }

  // Populate proxy-groups from the YAML configuration
  config["proxy-groups"] = [
    {
      name: "🚀 节点选择",
      type: "select",
      proxies: [
        "DIRECT",
        "⚡ 专线",
        "🇭🇰 香港",
        "🇯🇵 日本",
        "🇺🇲 美国",
        "🇸🇬 新加坡",
        "🇨🇳 台湾",
        "🇰🇷 韩国",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区",
        "🚀 手动切换"
      ]
    },
    {
      name: "🚀 手动切换",
      type: "select",
      "include-all": true,
    },
    {
      name: "🇯🇵 JP",
      type: "select",
      proxies: [
        "🇯🇵 日本",
        "⚡ 专线",
        "🇭 Hysteria2",
        "🇷 Reality"
      ],
      "include-all": true,
      filter: "(?i)(日本|川日|东京|大阪|泉日|埼玉|沪日|深日|[^-]日|JP|Japan)"
    },
    {
      name: "🖼️ EH",
      type: "select",
      proxies: [
        "DIRECT"
      ],
      "include-all": true,
    },
    {
      name: "🚫 广告屏蔽",
      type: "select",
      proxies: [
        "REJECT",
        "DIRECT",
        "🚀 节点选择",
        "🇭🇰 香港",
        "🇯🇵 日本",
        "🇺🇲 美国",
        "🇸🇬 新加坡",
        "🇨🇳 台湾",
        "🇰🇷 韩国",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区"
      ]
    },
    {
      name: "📙 BW",
      type: "select",
      proxies: [
        "DIRECT",
        "⚡ 专线",
        "🇭🇰 香港",
        "🇯🇵 日本",
        "🇺🇲 美国",
        "🇸🇬 新加坡",
        "🇨🇳 台湾",
        "🇰🇷 韩国",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区"
      ]
    },
    {
      name: "🕮 69",
      type: "select",
      proxies: [
        "DIRECT"
      ],
      "include-all": true,
    },
    {
      name: "🎥 海外媒体",
      type: "select",
      proxies: [
        "DIRECT",
        "⚡ 专线",
        "🇭🇰 香港",
        "🇯🇵 日本",
        "🇺🇲 美国",
        "🇸🇬 新加坡",
        "🇨🇳 台湾",
        "🇰🇷 韩国",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区"
      ],
      "include-all": true,
      filter: "宽频"
    },
    {
      name: "📺 哔哩哔哩",
      type: "select",
      proxies: [
        "DIRECT",
        "🇭🇰 香港",
        "🇨🇳 台湾",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区"
      ]
    },
    {
      name: "🍎 苹果服务",
      type: "select",
      proxies: [
        "DIRECT",
        "⚡ 专线",
        "🇭🇰 香港",
        "🇯🇵 日本",
        "🇺🇲 美国",
        "🇸🇬 新加坡",
        "🇨🇳 台湾",
        "🇰🇷 韩国",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区",
        "🚀 手动切换"
      ]
    },
    {
      name: "🎮 游戏平台",
      type: "select",
      proxies: [
        "DIRECT",
        "🚀 节点选择",
        "⚡ 专线",
        "🇭🇰 香港",
        "🇯🇵 日本",
        "🇺🇲 美国",
        "🇸🇬 新加坡",
        "🇨🇳 台湾",
        "🇰🇷 韩国",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区",
        "🚀 手动切换"
      ]
    },
    {
      name: "⚽ 游戏下载",
      type: "select",
      proxies: [
        "DIRECT",
        "🚀 节点选择",
        "⚡ 专线",
        "🇭🇰 香港",
        "🇯🇵 日本",
        "🇺🇲 美国",
        "🇸🇬 新加坡",
        "🇨🇳 台湾",
        "🇰🇷 韩国",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区",
        "🚀 手动切换"
      ]
    },
    {
      name: "Ⓜ️ 微软服务",
      type: "select",
      proxies: [
        "DIRECT",
        "🚀 节点选择",
        "🇭🇰 香港",
        "🇯🇵 日本",
        "🇺🇲 美国",
        "🇸🇬 新加坡",
        "🇨🇳 台湾",
        "🇰🇷 韩国",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区",
        "🚀 手动切换"
      ]
    },
    {
      name: "🅾︎ OneDrive",
      type: "select",
      proxies: [
        "DIRECT",
        "🚀 节点选择",
        "🇭🇰 香港",
        "🇯🇵 日本",
        "🇺🇲 美国",
        "🇸🇬 新加坡",
        "🇨🇳 台湾",
        "🇰🇷 韩国",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区",
        "🚀 手动切换"
      ]
    },
    {
      name: "🥦 AI",
      type: "select",
      proxies: [
        "DIRECT",
        "🚀 节点选择",
        "⚡ 专线",
        "🇭🇰 香港",
        "🇯🇵 日本",
        "🇺🇲 美国",
        "🇸🇬 新加坡",
        "🇨🇳 台湾",
        "🇰🇷 韩国",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区",
        "🚀 手动切换"
      ],
      "include-all": true,
      filter: "(B|D)"
    },
    {
      name: "🎯 全球直连",
      type: "select",
      proxies: [
        "DIRECT",
        "🚀 节点选择",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区",
        "🚀 手动切换"
      ]
    },
    {
      name: "🐟 漏网之鱼",
      type: "select",
      proxies: [
        "DIRECT",
        "🚀 节点选择",
        "⚡ 专线",
        "🇭🇰 香港",
        "🇯🇵 日本",
        "🇺🇲 美国",
        "🇸🇬 新加坡",
        "🇨🇳 台湾",
        "🇰🇷 韩国",
        "🇭 Hysteria2",
        "🇷 Reality",
        "🌐 其他地区",
        "🚀 手动切换"
      ]
    },
    {
      name: "⚡ 专线",
      type: "select",
      "include-all": true,
      filter: "(IEPL|IPLC|BGP|专线|B|D1R)"
    },
    {
      name: "🇭🇰 香港",
      type: "select",
      "include-all": true,
      filter: "(?i)(港|HK|Hong Kong|🇭🇰|HongKong)"
    },
    {
      name: "🇯🇵 日本",
      type: "select",
      "include-all": true,
      filter: "(?i)(日本|川日|东京|大阪|泉日|埼玉|沪日|深日|[^-]日|JP|Japan)"
    },
    {
      name: "🇺🇲 美国",
      type: "select",
      "include-all": true,
      filter: "(?i)(美|US|United States|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥)"
    },
    {
      name: "🇸🇬 新加坡",
      type: "select",
      "include-all": true,
      filter: "(?i)(新加坡|坡|狮城|SG|Singapore)"
    },
    {
      name: "🇨🇳 台湾",
      type: "select",
      "include-all": true,
      filter: "(?i)(台|新北|彰化|TW|Taiwan)"
    },
    {
      name: "🇰🇷 韩国",
      type: "select",
      "include-all": true,
      filter: "(?i)(KR|Korea|KOR|首尔|韩|韓)"
    },
    {
      name: "🇭 Hysteria2",
      type: "select",
      "include-all": true,
      filter: "(?i)Y"
    },
    {
      name: "🇷 Reality",
      type: "select",
      "include-all": true,
      filter: "(?i)V"
    },
    {
      name: "🌐 其他地区",
      type: "select",
      "include-all": true,
      filter: "^(?!.*(港|HK|🇭🇰|日本|JP|美|US|新加坡|坡|SG|台|新北|彰化|TW|KR|Korea|KOR|首尔|韩|韓|Y|V|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥)).*$"
    }
  ];

  // Populate rule-providers from the YAML configuration
  const myRuleProviders = {
    "Direct": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/lasthm/ImageHosting/refs/heads/self_clash/rules/Direct.list",
      path: "./ruleset/Direct.yaml",
      interval: 86400,
      format: "text"
    },
    "GameDownload": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/mmm1h/clashconfig/main/rules/GameDownload.list",
      path: "./ruleset/GameDownload.yaml",
      interval: 86400,
      format: "text"
    },
    "JP": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/lasthm/ImageHosting/refs/heads/self_clash/rules/JP.list",
      path: "./ruleset/JP.yaml",
      interval: 86400,
      format: "text"
    },
    "DMM": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/Dmm.list",
      path: "./ruleset/DMM.yaml",
      interval: 86400,
      format: "text"
    },
    "Rules": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/lasthm/ImageHosting/refs/heads/self_clash/rules/Rules.list",
      path: "./ruleset/Rules.yaml",
      interval: 86400,
      format: "text"
    },
    "BW": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/lasthm/ImageHosting/refs/heads/self_clash/rules/BW.list",
      path: "./ruleset/BW.yaml",
      interval: 86400,
      format: "text"
    },
    "69": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/lasthm/ImageHosting/refs/heads/self_clash/rules/69.list",
      path: "./ruleset/69.yaml",
      interval: 86400,
      format: "text"
    },
    "EH": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/EHGallery.list",
      path: "./ruleset/EH.yaml",
      interval: 86400,
      format: "text"
    },
    "GoogleFCM": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/GoogleFCM.list",
      path: "./ruleset/GoogleFCM.yaml",
      interval: 86400,
      format: "text"
    },
    "GoogleCN": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/GoogleCN.list",
      path: "./ruleset/GoogleCN.yaml",
      interval: 86400,
      format: "text"
    },
    "SteamCN": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/SteamCN.list",
      path: "./ruleset/SteamCN.yaml",
      interval: 86400,
      format: "text"
    },
    "OneDrive": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/OneDrive.list",
      path: "./ruleset/OneDrive.yaml",
      interval: 86400,
      format: "text"
    },
    "Microsoft": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Microsoft.list",
      path: "./ruleset/Microsoft.yaml",
      interval: 86400,
      format: "text"
    },
    "AIMerged": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/mmm1h/clashconfig/main/AIMerged.list",
      path: "./ruleset/AIMerged.yaml",
      interval: 86400,
      format: "text"
    },
    "AdBlockMerged": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/mmm1h/clashconfig/main/AdBlockMerged.list",
      path: "./ruleset/AdBlockMerged.yaml",
      interval: 86400,
      format: "text"
    },
    "Apple": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Apple.list",
      path: "./ruleset/Apple.yaml",
      interval: 86400,
      format: "text"
    },
    "GameMerged": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/mmm1h/clashconfig/main/GameMerged.list",
      path: "./ruleset/GameMerged.yaml",
      interval: 86400,
      format: "text"
    },
    "ProxyMediaMerged": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/mmm1h/clashconfig/main/ProxyMediaMerged.list",
      path: "./ruleset/ProxyMediaMerged.yaml",
      interval: 86400,
      format: "text"
    },
    "Bahamut": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Bahamut.list",
      path: "./ruleset/Bahamut.yaml",
      interval: 86400,
      format: "text"
    },
    "Bilibili": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Bilibili.list",
      path: "./ruleset/Bilibili.yaml",
      interval: 86400,
      format: "text"
    },
    "ProxyGFWlist": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyGFWlist.list",
      path: "./ruleset/ProxyGFWlist.yaml",
      interval: 86400,
      format: "text"
    },
    "Telegram": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Telegram.list",
      path: "./ruleset/Telegram.yaml",
      interval: 86400,
      format: "text"
    },
    "ChinaMerged": {
      type: "http",
      behavior: "classical",
      url: "https://raw.githubusercontent.com/mmm1h/clashconfig/main/ChinaMerged.list",
      path: "./ruleset/ChinaMerged.yaml",
      interval: 86400,
      format: "text"
    }
  };
  config["rule-providers"] = Object.assign(config["rule-providers"], myRuleProviders);

  // Populate rules from the YAML configuration
  config["rules"] = [
    // ;自定义规则
    "RULE-SET,JP,🇯🇵 JP",
    "RULE-SET,DMM,🇯🇵 JP",
    "RULE-SET,Rules,🚀 节点选择",
    "RULE-SET,BW,📙 BW",
    "RULE-SET,69,🕮 69",
    "RULE-SET,EH,🖼️ EH",
    "RULE-SET,Direct,🎯 全球直连",

    // ;直连规则
    "RULE-SET,GoogleFCM,🎯 全球直连",
    "RULE-SET,GoogleCN,🎯 全球直连",
    "RULE-SET,SteamCN,🎯 全球直连",

    // ;默认规则
    "RULE-SET,Microsoft,Ⓜ️ 微软服务",
    "RULE-SET,OneDrive,🅾︎ OneDrive",
    "RULE-SET,AIMerged,🥦 AI",
    "RULE-SET,Apple,🍎 苹果服务",
    "RULE-SET,GameMerged,🎮 游戏平台",
    "RULE-SET,GameDownload,⚽ 游戏下载",
    "RULE-SET,Bahamut,🇨🇳 台湾",
    "RULE-SET,Bilibili,📺 哔哩哔哩",
    "RULE-SET,ProxyMediaMerged,🎥 海外媒体",
    "RULE-SET,Telegram,🚀 节点选择",
    "RULE-SET,ProxyGFWlist,🚀 节点选择",

    // ;广告屏蔽
    "RULE-SET,AdBlockMerged,🚫 广告屏蔽",

    // ;中国大陆IP和域名直连
    "RULE-SET,ChinaMerged,🎯 全球直连",

    // ;GEOIP
    "GEOIP,CN,🎯 全球直连",

    // ;兜底规则
    "MATCH,🐟 漏网之鱼"
  ];

  return config;
}
