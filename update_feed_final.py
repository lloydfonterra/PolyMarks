with open('frontend/src/components/Dashboard/RealtimeTradeFeed.tsx', 'r') as f:
    lines = f.readlines()

# Find and replace the price display line
for i, line in enumerate(lines):
    if '{!isNaN(trade.price) ? trade.price.toFixed(2) : \'0.00\'}¢' in line and '</td>' in lines[i+1]:
        # Replace the next line with a flex div
        indent = '                '
        new_lines = [
            indent + '<div className="flex items-center gap-1">\n',
            line,
            indent + '  {priceDirection.get(trade.market) === \'up\' && (\n',
            indent + '    <TrendingUp className="w-4 h-4 text-accent-green animate-bounce" />\n',
            indent + '  )}\n',
            indent + '  {priceDirection.get(trade.market) === \'down\' && (\n',
            indent + '    <TrendingDown className="w-4 h-4 text-accent-red animate-bounce" />\n',
            indent + '  )}\n',
            indent + '</div>\n',
            lines[i+1]
        ]
        lines = lines[:i] + new_lines + lines[i+2:]
        break

with open('frontend/src/components/Dashboard/RealtimeTradeFeed.tsx', 'w') as f:
    f.writelines(lines)

print("Updated price display with momentum indicators")
