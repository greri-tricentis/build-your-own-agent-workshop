using WireMock.RequestBuilders;
using WireMock.ResponseBuilders;
using WireMock.Server;

namespace AgentTest;

public class ChatClientTests
{
    [Test]
    public void METHOD()
    {
        var server = WireMockServer.Start();
        
        server
            .Given(
                Request.Create().WithPath("/some/thing").UsingGet()
            )
            .RespondWith(
                Response.Create()
                    .WithStatusCode(200)
                    .WithHeader("Content-Type", "text/plain")
                    .WithBody("Hello world!")
            );
    }
}