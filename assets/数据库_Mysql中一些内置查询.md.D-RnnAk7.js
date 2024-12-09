import{_ as s,c as n,o as a,a1 as e}from"./chunks/framework.rLRl8Q3O.js";const u=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"数据库/Mysql中一些内置查询.md","filePath":"数据库/Mysql中一些内置查询.md","lastUpdated":1733724441000}'),p={name:"数据库/Mysql中一些内置查询.md"},l=e(`<ol><li>Mysql连接数查询</li></ol><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>show variables like &#39;%max_connection%&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>show global status like &#39;Thread%&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>show global status like &#39;Connections%&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>show variables like &#39;thread_cache_size&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>show processlist;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div>`,2),i=[l];function c(t,r,o,_,b,d){return a(),n("div",null,i)}const h=s(p,[["render",c]]);export{u as __pageData,h as default};
