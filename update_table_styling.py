with open('frontend/src/components/Dashboard/RealtimeTradeFeed.tsx', 'r') as f:
    content = f.read()

# Update Type column
content = content.replace(
    'px-6 py-4 whitespace-nowrap text-sm">',
    'px-3 py-2 whitespace-nowrap text-sm">'
)

# Update Size column
content = content.replace(
    'px-6 py-4 whitespace-nowrap text-sm font-medium transition-all $',
    'px-3 py-2 whitespace-nowrap text-sm font-medium transition-all w-20 $'
)

# Update Price column  
old_price = 'px-6 py-4 whitespace-nowrap text-sm font-bold transition-all ${'
new_price = 'px-3 py-2 whitespace-nowrap text-sm font-bold transition-all w-16 ${'
content = content.replace(old_price, new_price)

# Update Conviction column
old_conv = 'px-6 py-4">'
new_conv = 'px-3 py-2">'
# Only replace in conviction section
content = content.replace(
    '              </td>\n              <td className="px-6 py-4">\n                <div className="flex items-center gap-2">',
    '              </td>\n              <td className="px-3 py-2">\n                <div className="flex items-center gap-2 min-w-32">'
)

# Update conviction bar width
content = content.replace(
    '                  <div className="w-20 bg-conviction-800 rounded-full h-2">',
    '                  <div className="w-16 bg-conviction-800 rounded-full h-2">'
)

# Update conviction percentage display
content = content.replace(
    '                  <span className="text-xs text-whale-400">{trade.conviction}%</span>',
    '                  <span className="text-xs text-whale-400 w-12">{trade.conviction.toFixed(0)}%</span>'
)

# Update Time column
content = content.replace(
    'px-6 py-4 text-xs text-conviction-500">{trade.time}</td>',
    'px-3 py-2 text-xs text-conviction-500 w-24">{trade.time}</td>'
)

with open('frontend/src/components/Dashboard/RealtimeTradeFeed.tsx', 'w') as f:
    f.write(content)

print("Table styling updated for full-width display")
