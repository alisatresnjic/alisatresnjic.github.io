import{p as v}from"../modules/unplugin-icons-CQyH3IE2.js";import{d as g,z as x,o as c,b as _,e as r,f as b,h as k,c as y,k as $,aa as l,B as a,l as h,q as w,s as C}from"../modules/vue-Bl10Un54.js";import{u,f as B}from"./context-zPyJnwgr.js";import"../index-BwSvAdzK.js";import"../modules/shiki-Bn_9foU7.js";function d(e){return e.startsWith("/")?"/"+e.slice(1):e}function S(e,n=!1){const s=e&&["#","rgb","hsl"].some(i=>e.indexOf(i)===0),o={background:s?e:void 0,color:e&&!s?"white":void 0,backgroundImage:s?void 0:e?n?`linear-gradient(#0005, #0008), url(${d(e)})`:`url("${d(e)}")`:void 0,backgroundRepeat:"no-repeat",backgroundPosition:"center",backgroundSize:"cover"};return o.background||delete o.background,o}const z={class:"my-auto w-full"},P=g({__name:"cover",props:{background:{default:"https://source.unsplash.com/collection/94734566/1920x1080"}},setup(e){u();const n=e,s=x(()=>S(n.background,!0));return(o,i)=>(c(),_("div",{class:"slidev-layout cover text-center",style:k(s.value)},[r("div",z,[b(o.$slots,"default")])],4))}}),N={class:"pt-12"},H={__name:"slides.md__slidev_1",setup(e){const{$slidev:n,$nav:s,$clicksContext:o,$clicks:i,$page:T,$renderContext:V,$frontmatter:p}=u();return o.setup(),(A,t)=>{const m=v;return c(),y(P,w(C(a(B)(a(p),0))),{default:$(()=>[t[2]||(t[2]=r("h1",null,"Laravel",-1)),t[3]||(t[3]=r("div",{class:"text-white text-2xl bg-gray-500 bg-opacity-80 p-4 rounded inline-block animate-fade-in"},"Hanna Lackner",-1)),t[4]||(t[4]=l(" und ")),t[5]||(t[5]=r("div",{class:"text-white text-2xl bg-gray-500 bg-opacity-80 p-4 rounded inline-block animate-fade-in"},"Alisa Tresnjic",-1)),r("div",N,[r("span",{onClick:t[0]||(t[0]=(...f)=>a(n).nav.next&&a(n).nav.next(...f)),class:"px-4 py-2 rounded cursor-pointer hover:bg-white hover:bg-opacity-10 transition duration-300 animate-bounce"},[t[1]||(t[1]=l(" Start ")),h(m,{class:"inline"})])])]),_:1},16)}}};export{H as default};