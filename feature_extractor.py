import torch
from torchvision import models, transforms
from PIL import Image

# 加载ResNet18（去掉分类层）
model = models.resnet18(pretrained=True)
model = torch.nn.Sequential(*list(model.children())[:-1])
model.eval()

# 预处理
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def extract_feature(img_path):
    img = Image.open(img_path).convert('RGB')
    img = transform(img).unsqueeze(0)

    with torch.no_grad():
        feature = model(img)

    return feature.view(-1).numpy()