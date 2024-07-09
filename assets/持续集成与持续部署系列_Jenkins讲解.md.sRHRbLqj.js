import{_ as n,c as s,o as a,a1 as p}from"./chunks/framework.rLRl8Q3O.js";const e="/assets/jenkins_env.EwlaDf8L.png",v=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"持续集成与持续部署系列/Jenkins讲解.md","filePath":"持续集成与持续部署系列/Jenkins讲解.md","lastUpdated":1720510408000}'),l={name:"持续集成与持续部署系列/Jenkins讲解.md"},i=p(`<p>查看 Jenkins 系统内置环境变量 方法一： \${YOUR_JENKINS_HOST}/env-vars.html</p><p>方式二： 通过执行 printenv shell 命令来获取：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pipeline {</span></span>
<span class="line"><span>    agent any</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    stages {</span></span>
<span class="line"><span>        stage(&quot;Env Variables&quot;) {</span></span>
<span class="line"><span>            steps {</span></span>
<span class="line"><span>                sh &quot;printenv&quot;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>读取环境变量 上面我们说了 env 是环境变量的关键字，但是读取 Jenkins 内置的这些环境变量，env 关键字是可有可无, 但不能没了底裤，都要使用 \${xxx} 包围起来。以 BUILD_NUMBER 这个内置环境变量举例来说明就是这样滴：</p><p>自定义 Jenkins 环境变量 Jenkins pipeline 分声明式（Declarative）和 脚本式（imperative）写法，相应的环境变量定义方式也略有不同，归纳起来有三种方式： <img src="`+e+`" alt="sdf"></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pipeline {</span></span>
<span class="line"><span>    agent any</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    environment {</span></span>
<span class="line"><span>        FOO = &quot;bar&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    stages {</span></span>
<span class="line"><span>        stage(&quot;Custom Env Variables&quot;) {</span></span>
<span class="line"><span>            environment {</span></span>
<span class="line"><span>                NAME = &quot;RGYB&quot;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            steps {</span></span>
<span class="line"><span>                echo &quot;FOO = \${env.FOO}&quot;</span></span>
<span class="line"><span>                echo &quot;NAME = \${env.NAME}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                script {</span></span>
<span class="line"><span>                    env.SCRIPT_VARIABLE = &quot;Thumb Up&quot;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                echo &quot;SCRIPT_VARIABLE = \${env.SCRIPT_VARIABLE}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                withEnv([&quot;WITH_ENV_VAR=Come On&quot;]) {</span></span>
<span class="line"><span>                    echo &quot;WITH_ENV_VAR = \${env.WITH_ENV_VAR}&quot;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div>`,6),r=[i];function c(t,b,u,o,m,d){return a(),s("div",null,r)}const h=n(l,[["render",c]]);export{v as __pageData,h as default};
