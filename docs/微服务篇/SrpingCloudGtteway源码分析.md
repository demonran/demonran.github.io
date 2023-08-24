核心的几个接口
- WebFliter
- WebHandler
- HandlerMapping
- GatewayFilter
- GlobalFilter
- WebFilterChain

DefaultWebFilterChain
FilteringWebHandler

HttpHandler

HttpWebHandlerAdapter

请求流转顺序
HttpHandler -> WebHandler -> WebFilter -> GatewayFilter

HttpWebHandlerAdapter -> ExceptionHandlingWebHandler -> FilteringWebHandler -> 
DefaultWebFilterChain -> WebFilter -> DispatcherHandler -> HandlerMapping -> GatewayFilter