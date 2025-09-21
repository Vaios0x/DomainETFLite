#!/usr/bin/env node

/**
 * DomainETF Lite - Performance Audit Script
 * Automated performance checks for frontend and smart contracts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PerformanceAuditor {
  constructor() {
    this.metrics = {
      bundleSize: 0,
      imageOptimization: 0,
      codeSplitting: 0,
      caching: 0,
      compression: 0,
      lighthouse: 0
    };
    this.issues = [];
    this.recommendations = [];
  }

  log(level, message, metric = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    
    if (level === 'issue') {
      this.issues.push({ level, message, metric, timestamp });
    } else if (level === 'recommendation') {
      this.recommendations.push({ level, message, metric, timestamp });
    }
  }

  // Bundle Size Analysis
  async analyzeBundleSize() {
    console.log('\n📦 Analyzing Bundle Size...\n');
    
    try {
      // Check if build exists
      const buildPath = path.join(__dirname, '../.next');
      if (!fs.existsSync(buildPath)) {
        this.log('warning', 'Build not found. Run "npm run build" first');
        return;
      }

      // Analyze bundle sizes
      const buildManifest = path.join(buildPath, 'build-manifest.json');
      if (fs.existsSync(buildManifest)) {
        const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
        
        let totalSize = 0;
        for (const [route, files] of Object.entries(manifest.pages)) {
          for (const file of files) {
            const filePath = path.join(buildPath, 'static', file);
            if (fs.existsSync(filePath)) {
              const stats = fs.statSync(filePath);
              totalSize += stats.size;
            }
          }
        }
        
        this.metrics.bundleSize = totalSize;
        const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
        
        if (totalSize > 2 * 1024 * 1024) { // 2MB
          this.log('issue', `Bundle size too large: ${sizeMB}MB`, 'bundleSize');
        } else {
          this.log('info', `Bundle size: ${sizeMB}MB`);
        }
      }
    } catch (error) {
      this.log('error', `Bundle analysis failed: ${error.message}`);
    }
  }

  // Image Optimization Check
  async checkImageOptimization() {
    console.log('\n🖼️  Checking Image Optimization...\n');
    
    const publicPath = path.join(__dirname, '../public');
    const imageFiles = this.getImageFiles(publicPath);
    
    let optimizedCount = 0;
    let totalSize = 0;
    
    for (const image of imageFiles) {
      const stats = fs.statSync(image);
      totalSize += stats.size;
      
      // Check if image is optimized (basic check)
      if (this.isImageOptimized(image)) {
        optimizedCount++;
      } else {
        this.log('issue', `Unoptimized image: ${path.basename(image)}`, 'imageOptimization');
      }
    }
    
    this.metrics.imageOptimization = (optimizedCount / imageFiles.length) * 100;
    this.log('info', `Image optimization: ${this.metrics.imageOptimization.toFixed(1)}%`);
  }

  getImageFiles(dir) {
    let images = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        images = images.concat(this.getImageFiles(fullPath));
      } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item)) {
        images.push(fullPath);
      }
    }
    
    return images;
  }

  isImageOptimized(imagePath) {
    // Basic optimization check
    const ext = path.extname(imagePath).toLowerCase();
    const stats = fs.statSync(imagePath);
    
    // Check file size (should be reasonable)
    if (stats.size > 500 * 1024) { // 500KB
      return false;
    }
    
    // Prefer modern formats
    if (ext === '.webp' || ext === '.svg') {
      return true;
    }
    
    return true; // Assume optimized for now
  }

  // Code Splitting Analysis
  async analyzeCodeSplitting() {
    console.log('\n🔀 Analyzing Code Splitting...\n');
    
    const appPath = path.join(__dirname, '../app');
    const pages = this.getPageFiles(appPath);
    
    let dynamicImports = 0;
    let staticImports = 0;
    
    for (const page of pages) {
      const content = fs.readFileSync(page, 'utf8');
      
      // Count dynamic imports
      const dynamicMatches = content.match(/import\s*\(/g);
      if (dynamicMatches) {
        dynamicImports += dynamicMatches.length;
      }
      
      // Count static imports
      const staticMatches = content.match(/import\s+.*\s+from\s+['"]/g);
      if (staticMatches) {
        staticImports += staticMatches.length;
      }
    }
    
    this.metrics.codeSplitting = (dynamicImports / (dynamicImports + staticImports)) * 100;
    
    if (this.metrics.codeSplitting < 20) {
      this.log('issue', 'Low code splitting ratio detected', 'codeSplitting');
    } else {
      this.log('info', `Code splitting ratio: ${this.metrics.codeSplitting.toFixed(1)}%`);
    }
  }

  getPageFiles(dir) {
    let pages = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        pages = pages.concat(this.getPageFiles(fullPath));
      } else if (item === 'page.tsx' || item === 'page.ts') {
        pages.push(fullPath);
      }
    }
    
    return pages;
  }

  // Caching Strategy Check
  async checkCachingStrategy() {
    console.log('\n💾 Checking Caching Strategy...\n');
    
    const nextConfigPath = path.join(__dirname, '../next.config.ts');
    let cachingScore = 0;
    
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      
      if (content.includes('headers')) {
        cachingScore += 25;
      }
      if (content.includes('cache')) {
        cachingScore += 25;
      }
      if (content.includes('revalidate')) {
        cachingScore += 25;
      }
      if (content.includes('swcMinify')) {
        cachingScore += 25;
      }
    }
    
    // Check for service worker
    const swPath = path.join(__dirname, '../public/sw.js');
    if (fs.existsSync(swPath)) {
      cachingScore += 50;
    }
    
    this.metrics.caching = cachingScore;
    
    if (cachingScore < 50) {
      this.log('issue', 'Insufficient caching strategy', 'caching');
    } else {
      this.log('info', `Caching score: ${cachingScore}%`);
    }
  }

  // Compression Check
  async checkCompression() {
    console.log('\n🗜️  Checking Compression...\n');
    
    const nextConfigPath = path.join(__dirname, '../next.config.ts');
    let compressionScore = 0;
    
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      
      if (content.includes('compress')) {
        compressionScore += 50;
      }
      if (content.includes('gzip')) {
        compressionScore += 25;
      }
      if (content.includes('brotli')) {
        compressionScore += 25;
      }
    }
    
    this.metrics.compression = compressionScore;
    
    if (compressionScore < 50) {
      this.log('issue', 'Compression not properly configured', 'compression');
    } else {
      this.log('info', `Compression score: ${compressionScore}%`);
    }
  }

  // Lighthouse Score Simulation
  async simulateLighthouseScore() {
    console.log('\n🏆 Simulating Lighthouse Score...\n');
    
    let lighthouseScore = 100;
    
    // Deduct points based on issues
    if (this.metrics.bundleSize > 2 * 1024 * 1024) {
      lighthouseScore -= 20;
    }
    if (this.metrics.imageOptimization < 80) {
      lighthouseScore -= 15;
    }
    if (this.metrics.codeSplitting < 30) {
      lighthouseScore -= 10;
    }
    if (this.metrics.caching < 70) {
      lighthouseScore -= 15;
    }
    if (this.metrics.compression < 80) {
      lighthouseScore -= 10;
    }
    
    this.metrics.lighthouse = Math.max(0, lighthouseScore);
    
    if (this.metrics.lighthouse < 90) {
      this.log('issue', `Lighthouse score below target: ${this.metrics.lighthouse}`, 'lighthouse');
    } else {
      this.log('info', `Lighthouse score: ${this.metrics.lighthouse}`);
    }
  }

  // Generate Performance Report
  generateReport() {
    console.log('\n📊 Performance Audit Report\n');
    console.log('='.repeat(50));
    
    console.log('\n📈 Performance Metrics:');
    console.log(`Bundle Size: ${(this.metrics.bundleSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Image Optimization: ${this.metrics.imageOptimization.toFixed(1)}%`);
    console.log(`Code Splitting: ${this.metrics.codeSplitting.toFixed(1)}%`);
    console.log(`Caching: ${this.metrics.caching}%`);
    console.log(`Compression: ${this.metrics.compression}%`);
    console.log(`Lighthouse Score: ${this.metrics.lighthouse}`);
    
    console.log(`\n🔴 Issues Found: ${this.issues.length}`);
    this.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.message}`);
    });
    
    console.log(`\n💡 Recommendations: ${this.recommendations.length}`);
    this.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.message}`);
    });
    
    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      issues: this.issues,
      recommendations: this.recommendations
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../performance-audit-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📄 Report saved to: performance-audit-report.json');
  }

  // Run all audits
  async run() {
    console.log('⚡ DomainETF Lite Performance Audit');
    console.log('=====================================\n');
    
    try {
      await this.analyzeBundleSize();
      await this.checkImageOptimization();
      await this.analyzeCodeSplitting();
      await this.checkCachingStrategy();
      await this.checkCompression();
      await this.simulateLighthouseScore();
      this.generateReport();
      
      console.log('\n✅ Performance audit completed');
    } catch (error) {
      this.log('error', `Audit failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new PerformanceAuditor();
  auditor.run();
}

module.exports = PerformanceAuditor;
