alias etcdctl='etcdctl --endpoints=https://192.168.1.134:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key'

<!-- tabs:start -->
#### **English**


kubeadm join 192.168.1.134:6443 --token 85y4b8.lim6y5vbpyuiiujl --discovery-token-ca-cert-hash sha256:5981c62bbc2c6125edb5dd870a8b24e3a2d879f978ce56c23ad4c40eebffd630 --control-plane --certificate-key 5dd9f93276becb10f1ece84c2618512f4b6fb97450779c0602cc678a5f1c0411
<!-- tabs:end -->

etcdctl member add node3 --peer-urls="http://192.168.1.136:2380"  --client-urls="http://192.168.1.136:2379"

etcdctl get --prefix "" > /var/lib/etcd/text

etcdctl  --prefix --keys-only=true get /
etcdctl  --prefix --keys-only=false get /
etcdctl --prefix   get /

etcdctl member list


 kubeadm join 192.168.1.134:6443 --token 7wqa8r.2lxv4wwmjyw1kpzh --discovery-token-ca-cert-hash sha256:5981c62bbc2c6125edb5dd870a8b24e3a2d879f978ce56c23ad4c40eebffd630  --control-plane --certificate-key 380d1e8acc97cbaf4f5bbe13be56dfcda5f6783311982a45b26a854ada5f810a