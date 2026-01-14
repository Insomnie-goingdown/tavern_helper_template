<template>
  <div class="phone-shell">
    <!-- Dynamic Island + Independent Status Bar -->
    <div class="status-wrap">
      <div class="dynamic-island"><div class="cam"></div></div>
      <div class="status-bar">
        <div class="left">
          <span class="time">{{ time }}</span>
          <i class="fa fa-signal"></i>
          <i class="fa fa-wifi"></i>
        </div>
        <div class="middle"></div>
        <div class="right">
          <span class="weather">{{ weather }}</span>
          <i class="fa fa-battery-three-quarters"></i>
        </div>
      </div>
    </div>

    <!-- Content area bounded by safe area: top: var(--safe-top), bottom: var(--tab-height) -->
    <div class="content">
      <section v-if="tab==='news'" class="news">
        <div class="ticker"><div class="strip" :style="{transform:`translateX(${ticker}px)`}">
          <span v-for="(h,i) in headlines" :key="i" class="h">{{ h }} · </span>
        </div></div>
        <div class="banner">
          <div class="l">
            <div class="live">LIVE</div>
            <h2>{{ locationTitle }}</h2>
            <p class="date">{{ dateText }}</p>
          </div>
          <div class="r"><span class="chip">{{ weather }}</span></div>
        </div>
        <div class="list">
          <article v-for="(n,i) in feed.slice(0,5)" :key="i" class="card">
            <header><span class="pill">{{ n.tag }}</span><span class="t">{{ n.time }}</span></header>
            <h3>{{ n.title }}</h3>
            <p class="abs">{{ n.abs }}</p>
            <div class="comments" v-if="n.comments?.length">
              <div class="c" v-for="(c,j) in n.comments" :key="j"><b>{{ c.user }}</b><i>{{ c.time }}</i><span>{{ c.text }}</span></div>
            </div>
          </article>
        </div>
      </section>

      <section v-else-if="tab==='msg'" class="msg">
        <div v-if="sel===-1" class="list">
          <div class="item" v-for="(m,i) in msgs" :key="i" @click="open(i)">
            <div class="av">{{ m.name[0] }}</div>
            <div class="meta"><div class="row"><b>{{ m.name }}</b><i>{{ m.time }}</i></div><p>{{ m.preview }}</p></div>
            <div class="dot" v-if="m.unread"></div>
          </div>
        </div>
        <div v-else class="conv">
          <header class="conv-h"><button class="back" @click="sel=-1">〈</button><b>{{ msgs[sel].name }}</b></header>
          <div class="conv-body">
            <div v-for="(b,i) in msgs[sel].history" :key="i" :class="['bubble', b.sent?'me':'them']">
              <p>{{ b.text }}</p><i>{{ b.time }}</i>
            </div>
          </div>
          <div class="conv-input"><input v-model="reply" placeholder="输入回复..." @keyup.enter="send"><button @click="send">发送</button></div>
        </div>
      </section>

      <section v-else class="bio">
        <div class="panel">
          <h3>健康监测系统</h3><p>实时生理数据记录</p>
        </div>
        <div class="grid2">
          <div class="tile"><label>做爱次数</label><b>{{ sStats.sex }}</b></div>
          <div class="tile"><label>己方高潮</label><b>{{ sStats.orgasm }}</b></div>
        </div>
        <div class="box">
          <h4>体液与怀孕</h4>
          <div class="bar"><span>受孕概率</span><div class="prog"><i :style="{width: preg+'%'}"></i></div><b>{{ preg }}%</b></div>
        </div>
      </section>
    </div>

    <!-- Bottom tab bar (fixed) -->
    <nav class="tabs">
      <button :class="{on:tab==='news'}" @click="tab='news'"><i class="fa fa-newspaper-o"></i><span>资讯</span></button>
      <button :class="{on:tab==='msg'}"  @click="tab='msg'"><i class="fa fa-comment"></i><span>短信</span></button>
      <button :class="{on:tab==='bio'}"  @click="tab='bio'"><i class="fa fa-heartbeat"></i><span>体征</span></button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const TAB_H = 58;
const SAFE_TOP = 104;

const tab = ref<'news'|'msg'|'bio'>('news');
const time = ref('');
const weather = ref('晴 22℃');
const headlines = ref<string[]>([]);
const ticker = ref(0);
const locationTitle = ref('未知城市早报');
const dateText = ref('');

// News feed mock
const feed = ref<Array<{tag:string,title:string,abs:string,time:string,comments?:{user:string,text:string,time:string}[]}>>([]);

// Messages mock
const msgs = ref<Array<{name:string, preview:string, time:string, unread:boolean, history:{text:string,time:string,sent:boolean}[]}>>([]);
const sel = ref(-1);
const reply = ref('');

// Bio mock
const sStats = ref({ sex: 0, orgasm: 0 });
const preg = ref(12);

function updTime(){ const n=new Date(); time.value=`${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}`; }
function open(i:number){ sel.value=i; msgs.value[i].unread=false; }
async function send(){ if(!reply.value.trim()||sel.value<0) return; const s=msgs.value[sel.value]; const n=new Date(); const t=`${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}`; s.history.push({text:reply.value,time:t,sent:true}); s.preview=reply.value; s.time=t; reply.value=''; try{ const escaped=reply.value.replace(/"/g,'\\"'); await triggerSlash(`/setinput "${escaped}"`);}catch(_){} }

onMounted(()=>{
  // safe-area as CSS vars
  document.documentElement.style.setProperty('--safe-top', SAFE_TOP+'px');
  document.documentElement.style.setProperty('--tab-height', TAB_H+'px');

  updTime(); setInterval(updTime, 1000);
  const now=new Date(); dateText.value=`${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`;

  try{
    const vars= typeof getVariables==='function' && typeof getCurrentMessageId==='function' ? getVariables({type:'message',message_id:getCurrentMessageId()}) : {};
    const world=vars?.stat_data?.世界||vars?.世界||{};
    const place=world.当前地点||vars['user_location']||vars['世界观名称']||'未知城市';
    const nowStr=world.当前时间||''; let hour=new Date().getHours(); const m=nowStr.match(/(\d{2}):(\d{2})/); if(m) hour=+m[1];
    locationTitle.value=`${place}${hour>=18?'夜讯':'早报'}`;
    const w=world.天气||vars.weather||'晴'; const t=world.温度||vars.temperature||'22℃'; weather.value = `${w} ${typeof t==='number'?t+'℃':t}`;
  }catch(_){ }

  headlines.value=['道路通行秩序良好','公共服务稳定运行','市民生活有序'];
  feed.value=[
    { tag:'快讯', title:'今日简讯', abs:'城市运转正常，重点民生项目推进中，整体秩序稳定向好。', time:'10:30', comments:[{user:'市民A',text:'越来越方便。',time:'10:35'}]},
    { tag:'本地', title:'社区志愿服务周启动', abs:'多项便民服务同步开展，参与度提高。', time:'09:15' },
    { tag:'世界', title:'国际合作稳步推进', abs:'多国达成联合倡议，前景看好。', time:'08:00' },
    { tag:'突发', title:'地铁临时延误', abs:'信号短暂异常导致 5-8 分钟延误。', time:'08:45' },
  ];

  msgs.value=[
    { name:'朋友A', preview:'今天有空吗？', time:'14:30', unread:true, history:[{text:'今天有空吗？', time:'14:30', sent:false}]},
  ];

  setInterval(()=>{ ticker.value -=1; const w=headlines.value.length*300; if(Math.abs(ticker.value)>=w) ticker.value=0; }, 50);
});
</script>

<style scoped>
:root { --safe-top: 104px; --tab-height: 58px; --bg:#0e0f12; }
.phone-shell{ width:min(440px,96vw); aspect-ratio:440/956; background:#000; border-radius:32px; box-shadow:0 24px 68px rgba(0,0,0,.45); position:relative; overflow:hidden; }

/* Status area */
.status-wrap{ position:absolute; left:0; right:0; top:0; height:var(--safe-top); z-index:30; }
.dynamic-island{ position:absolute; top:10px; left:50%; transform:translateX(-50%); width:126px; height:37px; background:#0a0a0a; border-radius:22px; box-shadow:0 2px 8px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.03); z-index:32; }
.dynamic-island .cam{ position:absolute; right:16px; top:50%; transform:translateY(-50%); width:6px; height:6px; border-radius:50%; background:#111; }
.status-bar{ position:absolute; left:0; right:0; bottom:0; height:44px; padding:0 14px; display:grid; grid-template-columns:auto 1fr auto; align-items:center; color:#fff; font-size:12px; background:rgba(10,10,10,.92); backdrop-filter:blur(10px); z-index:31; }
.status-bar .left,.status-bar .right{ display:flex; gap:8px; align-items:center; }
.status-bar .time{ font-weight:700; letter-spacing:.5px; }

/* Content */
.content{ position:absolute; left:0; right:0; top:calc(var(--safe-top) + 6px); bottom:var(--tab-height); overflow:auto; background:#f4f5f6; }

.ticker{ background:#ff6b6b; color:#fff; font-weight:700; font-size:12px; white-space:nowrap; overflow:hidden; padding:8px 0; position:sticky; top:0; z-index:1; }
.ticker .strip{ display:inline-block; transition:transform .05s linear; }
.ticker .h{ display:inline-block; margin-right:20px; }
.banner{ display:flex; align-items:flex-end; justify-content:space-between; padding:16px 14px; color:#fff; background:linear-gradient(135deg,#667eea,#764ba2); }
.banner .live{ background:#ff3b30; border-radius:6px; padding:2px 6px; font-size:10px; font-weight:700; margin-bottom:6px; display:inline-block; }
.banner h2{ margin:0; font-size:22px; font-weight:800; letter-spacing:.5px; }
.banner .date{ margin:4px 0 0 0; font-size:12px; opacity:.9; }
.banner .chip{ background:rgba(255,255,255,.2); padding:6px 10px; border-radius:12px; font-weight:700; font-size:12px; }
.list{ padding:10px; }
.card{ background:#fff; border-radius:10px; padding:12px; margin-bottom:10px; box-shadow:0 2px 6px rgba(0,0,0,.08); }
.card header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
.pill{ background:#667eea; color:#fff; border-radius:999px; padding:4px 10px; font-size:12px; font-weight:700; box-shadow:0 2px 8px rgba(102,126,234,.35); }
.card h3{ margin:0 0 6px 0; font-size:16px; font-weight:800; color:#2b2b2b; }
.abs{ margin:0; font-size:14px; color:#555; line-height:1.55; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.comments{ margin-top:10px; padding-top:10px; border-top:1px solid #eee; }
.comments .c{ display:grid; grid-template-columns:auto 1fr auto; gap:6px; font-size:12px; }
.comments .c b{ color:#667eea; }
.comments .c i{ color:#999; }

/* Messages */
.msg .list{ padding:8px; }
.msg .item{ background:#fff; border-radius:12px; padding:10px; display:flex; gap:10px; align-items:center; margin-bottom:8px; position:relative; }
.msg .av{ width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg,#667eea,#764ba2); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; }
.msg .meta .row{ display:flex; justify-content:space-between; font-weight:700; }
.msg .meta p{ margin:2px 0 0 0; color:#666; font-size:13px; }
.msg .dot{ width:10px; height:10px; background:#ff3b30; border-radius:50%; position:absolute; right:10px; top:10px; }
.conv{ height:100%; display:flex; flex-direction:column; }
.conv-h{ background:#fff; border-bottom:1px solid #e0e0e0; padding:10px; display:flex; align-items:center; gap:10px; }
.back{ width:30px; height:30px; border-radius:15px; border:none; background:#f0f0f0; cursor:pointer; }
.conv-body{ flex:1; overflow:auto; padding:12px; display:flex; flex-direction:column; gap:10px; }
.bubble{ max-width:75%; padding:10px 14px; border-radius:18px; }
.bubble.me{ align-self:flex-end; background:#007aff; color:#fff; border-bottom-right-radius:4px; }
.bubble.them{ align-self:flex-start; background:#e5e5ea; color:#000; border-bottom-left-radius:4px; }
.bubble i{ display:block; text-align:right; font-size:11px; opacity:.7; }
.conv-input{ display:flex; gap:8px; padding:10px; background:#fff; border-top:1px solid #e0e0e0; }
.conv-input input{ flex:1; padding:10px 12px; border:1px solid #e0e0e0; border-radius:20px; }

/* Bio */
.panel{ margin:12px; padding:16px; border-radius:12px; background:linear-gradient(135deg,#667eea,#764ba2); color:#fff; text-align:center; }
.grid2{ padding:12px; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.tile{ background:#fff; border-radius:10px; padding:14px; text-align:center; }
.tile label{ display:block; font-size:12px; color:#666; margin-bottom:6px; }
.tile b{ font-size:22px; }
.box{ margin:12px; background:#fff; border-radius:10px; padding:12px; }
.bar{ display:grid; grid-template-columns:auto 1fr auto; gap:10px; align-items:center; }
.prog{ height:8px; background:#eee; border-radius:4px; overflow:hidden; }
.prog i{ display:block; height:100%; background:linear-gradient(90deg,#ff6b6b,#ee5a6f); }

/* Tabs */
.tabs{ position:absolute; left:0; right:0; bottom:0; height:var(--tab-height); background:#fff; border-top:1px solid #e0e0e0; display:flex; }
.tabs button{ flex:1; border:none; background:transparent; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; color:#666; cursor:pointer; }
.tabs button.on{ color:#667eea; }
</style>

