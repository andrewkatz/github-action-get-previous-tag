const { exec } = require('child_process');
const fs = require('fs');

exec(`git for-each-ref --sort=-creatordate --count 1 --format="%(refname:short)" "refs/tags/*"`, (err, tag, stderr) => {
    tag = tag.trim();

    if (err) {
        console.log('\x1b[33m%s\x1b[0m', 'Could not find any tags because: ');
        console.log('\x1b[31m%s\x1b[0m', stderr);
        process.exit(1);
    } else if (tag === "") {
        let timestamp = Math.floor(new Date().getTime() / 1000);
        console.log('\x1b[33m%s\x1b[0m', 'Falling back to default tag');
        console.log('\x1b[32m%s\x1b[0m', `Found tag: ${process.env.INPUT_FALLBACK}`);
        console.log('\x1b[32m%s\x1b[0m', `Found timestamp: ${timestamp}`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `tag=${process.env.INPUT_FALLBACK}\r\n`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `timestamp=${timestamp}\r\n`);
        process.exit(0);
    }

    exec(`git log -1 --format=%at ${tag}`, (err, timestamp, stderr) => {
        if (err) {
            console.log('\x1b[33m%s\x1b[0m', 'Could not find any timestamp because: ');
            console.log('\x1b[31m%s\x1b[0m', stderr);
            process.exit(1);
        }

        timestamp = timestamp.trim();

        console.log('\x1b[32m%s\x1b[0m', `Found tag: ${tag}`);
        console.log('\x1b[32m%s\x1b[0m', `Found timestamp: ${timestamp}`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `tag=${tag}\r\n`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `timestamp=${timestamp}\r\n`);
        process.exit(0);
    });
});
