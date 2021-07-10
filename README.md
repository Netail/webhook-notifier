# Webhook Notifier

GitHub Action to send messages to different webhooks

## Getting Started

Create a new GitHub Actions workflow (e.g. `.github/workflows/notifier.yml`)

### Example workflow

An example of the GitHub Actions workflow

```yml
name: 'Pull Request Notifier'

on:
  pull_request:
    types: [opened]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
    - uses: Netail/webhook-notifier@v1
      with:
        discord-url: 'https://discord.com/api/webhooks/...'
        teams-url: 'https://outlook.office.com/webhook/...'
        slack-url: 'https://hooks.slack.com/services/...'
        color: 'info'
        title: '${{ github.event.pull_request.user.login }} opened PR-${{ github.event.number }} in ${{ github.event.repository.name }}'
        text: ${{ github.event.pull_request.title }}
        fields: '[{"name": "Repository", "value": "${{ github.event.repository.name }}"}, {"name": "Pull Request ID", "value": "${{ github.event.number }}"}]'
        buttons: '[{"label": "View PR", "url": "${{ github.event.pull_request.html_url }}"}]'
```

## Inputs

The action has any of the follow inputs

| Name | Description | Default | Notes |
| - | - | - | - |
| `discord-url` | Discord Webhook URL | N/A | Discord does not support buttons in incoming webhooks yet |
| `teams-url` | Teams Webhook URL | N/A |  |
| `slack-url` | Slack Webhook URL | N/A |  |
| `color` | Color of the message in hexadecimal or title of predefined | `success` |  |
| `title` | Text at the top of the message | `Hello world!` |  |
| `text` | Text to be displayed under the title | N/A |  |
| `fields` | Extra info to be displayed under the message | N/A | Stringified JSON array of objects with the attributes `name` and `value` ( e.g. `'[{"name": "string", "value": "string"}]'`) |
| `buttons` | Additional buttons under the message | N/A | Stringified JSON array of objects with the attributes `label` and `url` ( e.g. `'[{"label": "string", "url": "string"}]'`) |
