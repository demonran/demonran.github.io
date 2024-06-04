import{_ as s,c as n,o as a,a1 as e}from"./chunks/framework.rLRl8Q3O.js";const h=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"linux系列/linux磁盘动态扩容.md","filePath":"linux系列/linux磁盘动态扩容.md","lastUpdated":1717488754000}'),p={name:"linux系列/linux磁盘动态扩容.md"},l=e(`<h3 id="使用lvm动态扩容磁盘" tabindex="-1">使用lvm动态扩容磁盘 <a class="header-anchor" href="#使用lvm动态扩容磁盘" aria-label="Permalink to &quot;使用lvm动态扩容磁盘&quot;">​</a></h3><h4 id="磁盘分区" tabindex="-1">磁盘分区 <a class="header-anchor" href="#磁盘分区" aria-label="Permalink to &quot;磁盘分区&quot;">​</a></h4><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>fdisk /dev/vdc</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Command (m for help): n</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Select (default p): p</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Partition number (2-4, default 2): </span></span>
<span class="line"><span></span></span>
<span class="line"><span>Last sector, +sectors or +size{K,M,G} (62916608-419430399, default 419430399):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Command (m for help): w</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>如果出现如下waring：df The partition table has been altered!</p><p>Calling ioctl() to re-read partition table.</p><p>WARNING: Re-reading the partition table failed with error 16: Device or resource busy. The kernel still uses the old table. The new table will be used at the next reboot or after you run partprobe(8) or kpartx(8)</p><p>为了不重启生效,可以执行如下命令：partprobe</p><h4 id="增加逻辑存储" tabindex="-1">增加逻辑存储 <a class="header-anchor" href="#增加逻辑存储" aria-label="Permalink to &quot;增加逻辑存储&quot;">​</a></h4><ol><li>增加物理卷（PV) 将创建的分区转换成pv</li></ol><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pvcreate /dev/vdc2</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><ol start="2"><li>查看卷组（VG)</li></ol><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@node2 data]# vgs</span></span>
<span class="line"><span>  VG     #PV #LV #SN Attr   VSize   VFree</span></span>
<span class="line"><span>  centos   2   2   0 wz--n- 218.99g 170.00g</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><ol start="3"><li>将PV添加到卷组</li></ol><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>vgextend centos /dev/vdc2</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><ol start="4"><li>查看逻辑卷（LV)</li></ol><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@node2 data]# lvdisplay</span></span>
<span class="line"><span>  --- Logical volume ---</span></span>
<span class="line"><span>  LV Path                /dev/centos/swap</span></span>
<span class="line"><span>  LV Name                swap</span></span>
<span class="line"><span>  VG Name                centos</span></span>
<span class="line"><span>  LV UUID                zCWFAk-qd0b-iAs9-4fDB-p2mY-NbfO-eUTNC8</span></span>
<span class="line"><span>  LV Write Access        read/write</span></span>
<span class="line"><span>  LV Creation host, time localhost.localdomain, 2019-06-12 16:15:42 +0800</span></span>
<span class="line"><span>  LV Status              available</span></span>
<span class="line"><span>  # open                 0</span></span>
<span class="line"><span>  LV Size                &lt;3.88 GiB</span></span>
<span class="line"><span>  Current LE             992</span></span>
<span class="line"><span>  Segments               1</span></span>
<span class="line"><span>  Allocation             inherit</span></span>
<span class="line"><span>  Read ahead sectors     auto</span></span>
<span class="line"><span>  - currently set to     8192</span></span>
<span class="line"><span>  Block device           253:1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  --- Logical volume ---</span></span>
<span class="line"><span>  LV Path                /dev/centos/root</span></span>
<span class="line"><span>  LV Name                root</span></span>
<span class="line"><span>  VG Name                centos</span></span>
<span class="line"><span>  LV UUID                2Fe2A4-Z22o-ada3-9a6K-6ISL-tCor-JJGTE8</span></span>
<span class="line"><span>  LV Write Access        read/write</span></span>
<span class="line"><span>  LV Creation host, time localhost.localdomain, 2019-06-12 16:15:42 +0800</span></span>
<span class="line"><span>  LV Status              available</span></span>
<span class="line"><span>  # open                 1</span></span>
<span class="line"><span>  LV Size                &lt;45.12 GiB</span></span>
<span class="line"><span>  Current LE             11550</span></span>
<span class="line"><span>  Segments               1</span></span>
<span class="line"><span>  Allocation             inherit</span></span>
<span class="line"><span>  Read ahead sectors     auto</span></span>
<span class="line"><span>  - currently set to     8192</span></span>
<span class="line"><span>  Block device           253:0</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br></div></div><ol start="5"><li>扩容</li></ol><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> lvextend -L +50G /dev/centos/root</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><ol start="6"><li>使文件系统生效</li></ol><ul><li>查看挂载路径</li></ul><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@node2 data]# df -h</span></span>
<span class="line"><span>Filesystem               Size  Used Avail Use% Mounted on</span></span>
<span class="line"><span>/dev/mapper/centos-root   46G   44G  2.0G  96% /</span></span>
<span class="line"><span>devtmpfs                 7.8G     0  7.8G   0% /dev</span></span>
<span class="line"><span>tmpfs                    7.8G   83M  7.7G   2% /dev/shm</span></span>
<span class="line"><span>tmpfs                    7.8G  795M  7.0G  11% /run</span></span>
<span class="line"><span>tmpfs                    7.8G     0  7.8G   0% /sys/fs/cgroup</span></span>
<span class="line"><span>/dev/vda1               1014M  145M  870M  15% /boot</span></span>
<span class="line"><span>tmpfs                    1.6G     0  1.6G   0% /run/user/0</span></span>
<span class="line"><span>/dev/vdc1                 30G  979M   27G   4% /minio/dev_data</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>查看分区文件系统 df -T</p><ol start="2"><li>使文件系统生效</li></ol><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>xfs_growfs /dev/mapper/centos-root  #xfs扩容</span></span>
<span class="line"><span>resize2fs /dev/mapper/centos-root   #ext4扩容</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div>`,24),i=[l];function r(t,c,o,b,d,u){return a(),n("div",null,i)}const v=s(p,[["render",r]]);export{h as __pageData,v as default};
