import http.server
import socketserver
import webbrowser

PORT = 81

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Serving CLever at port", PORT)
    webbrowser.open('http://localhost:' + str(PORT))
    httpd.serve_forever()
