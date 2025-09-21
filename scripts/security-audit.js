#!/usr/bin/env node

/**
 * DomainETF Lite - Security Audit Script
 * Automated security checks for smart contracts and frontend
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SecurityAuditor {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.contractsPath = path.join(__dirname, '../contracts');
    this.frontendPath = path.join(__dirname, '../app');
  }

  log(level, message, file = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}${file ? ` (${file})` : ''}`;
    
    if (level === 'error') {
      this.issues.push({ level, message, file, timestamp });
    } else if (level === 'warning') {
      this.warnings.push({ level, message, file, timestamp });
    }
    
    console.log(logMessage);
  }

  // Smart Contract Security Checks
  async auditContracts() {
    console.log('\n🔍 Auditing Smart Contracts...\n');
    
    const contractFiles = fs.readdirSync(this.contractsPath)
      .filter(file => file.endsWith('.sol'));

    for (const file of contractFiles) {
      await this.auditContract(file);
    }
  }

  async auditContract(filename) {
    const filePath = path.join(this.contractsPath, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    this.log('info', `Auditing contract: ${filename}`);
    
    // Check for common vulnerabilities
    this.checkReentrancy(content, filename);
    this.checkIntegerOverflow(content, filename);
    this.checkAccessControl(content, filename);
    this.checkGasOptimization(content, filename);
    this.checkEventEmission(content, filename);
    this.checkErrorHandling(content, filename);
  }

  checkReentrancy(content, filename) {
    const hasReentrancyGuard = content.includes('ReentrancyGuard');
    const hasExternalCalls = content.includes('.call(') || content.includes('.transfer(') || content.includes('.send(');
    
    if (hasExternalCalls && !hasReentrancyGuard) {
      this.log('warning', 'External calls without ReentrancyGuard detected', filename);
    }
  }

  checkIntegerOverflow(content, filename) {
    const hasUncheckedMath = content.includes('unchecked');
    const hasSafeMath = content.includes('SafeMath') || content.includes('@openzeppelin');
    
    if (hasUncheckedMath && !hasSafeMath) {
      this.log('warning', 'Unchecked arithmetic operations detected', filename);
    }
  }

  checkAccessControl(content, filename) {
    const hasOwnable = content.includes('Ownable');
    const hasAccessControl = content.includes('AccessControl');
    const hasPublicFunctions = content.match(/function\s+\w+\s*\([^)]*\)\s+public/g);
    
    if (hasPublicFunctions && hasPublicFunctions.length > 0 && !hasOwnable && !hasAccessControl) {
      this.log('warning', 'Public functions without access control detected', filename);
    }
  }

  checkGasOptimization(content, filename) {
    const hasLoops = content.includes('for(') || content.includes('while(');
    const hasUnboundedLoops = content.match(/for\s*\(\s*[^;]*;\s*[^;]*;\s*[^)]*\)/g);
    
    if (hasUnboundedLoops) {
      this.log('warning', 'Potential unbounded loops detected', filename);
    }
  }

  checkEventEmission(content, filename) {
    const hasEvents = content.includes('event ');
    const hasEmit = content.includes('emit ');
    
    if (hasEvents && !hasEmit) {
      this.log('warning', 'Events defined but not emitted', filename);
    }
  }

  checkErrorHandling(content, filename) {
    const hasRequire = content.includes('require(');
    const hasRevert = content.includes('revert ');
    const hasTryCatch = content.includes('try ') && content.includes('catch ');
    
    if (!hasRequire && !hasRevert && !hasTryCatch) {
      this.log('warning', 'No error handling mechanisms detected', filename);
    }
  }

  // Frontend Security Checks
  async auditFrontend() {
    console.log('\n🔍 Auditing Frontend Security...\n');
    
    await this.checkDependencies();
    await this.checkEnvironmentVariables();
    await this.checkXSSVulnerabilities();
    await this.checkCSRFProtection();
    await this.checkContentSecurityPolicy();
  }

  async checkDependencies() {
    const packageJsonPath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check for known vulnerable packages
    const vulnerablePackages = [
      'lodash',
      'moment',
      'jquery',
      'express',
      'socket.io'
    ];
    
    for (const pkg of vulnerablePackages) {
      if (packageJson.dependencies?.[pkg] || packageJson.devDependencies?.[pkg]) {
        this.log('warning', `Potentially vulnerable package detected: ${pkg}`);
      }
    }
  }

  async checkEnvironmentVariables() {
    const envExamplePath = path.join(__dirname, '../env.example');
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    
    // Check for sensitive data in environment variables
    const sensitivePatterns = [
      /PRIVATE_KEY/,
      /SECRET/,
      /PASSWORD/,
      /API_KEY/
    ];
    
    for (const pattern of sensitivePatterns) {
      if (pattern.test(envExample)) {
        this.log('info', `Sensitive environment variable pattern found: ${pattern.source}`);
      }
    }
  }

  async checkXSSVulnerabilities() {
    const jsxFiles = this.getFilesRecursively(this.frontendPath, '.tsx');
    
    for (const file of jsxFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for dangerous HTML injection patterns
      if (content.includes('dangerouslySetInnerHTML')) {
        this.log('warning', 'dangerouslySetInnerHTML usage detected', file);
      }
      
      if (content.includes('innerHTML')) {
        this.log('warning', 'innerHTML usage detected', file);
      }
    }
  }

  async checkCSRFProtection() {
    const apiFiles = this.getFilesRecursively(path.join(this.frontendPath, 'api'), '.ts');
    
    for (const file of apiFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.includes('POST') || content.includes('PUT') || content.includes('DELETE')) {
        if (!content.includes('csrf') && !content.includes('origin')) {
          this.log('warning', 'API endpoint without CSRF protection detected', file);
        }
      }
    }
  }

  async checkContentSecurityPolicy() {
    const layoutFiles = this.getFilesRecursively(this.frontendPath, 'layout.tsx');
    
    for (const file of layoutFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      if (!content.includes('Content-Security-Policy')) {
        this.log('warning', 'No Content Security Policy detected', file);
      }
    }
  }

  getFilesRecursively(dir, extension) {
    let files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.getFilesRecursively(fullPath, extension));
      } else if (item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // Generate Security Report
  generateReport() {
    console.log('\n📊 Security Audit Report\n');
    console.log('='.repeat(50));
    
    console.log(`\n🔴 Issues Found: ${this.issues.length}`);
    this.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.message} (${issue.file})`);
    });
    
    console.log(`\n🟡 Warnings: ${this.warnings.length}`);
    this.warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning.message} (${warning.file})`);
    });
    
    const totalIssues = this.issues.length + this.warnings.length;
    const severity = totalIssues === 0 ? 'LOW' : 
                    totalIssues < 5 ? 'MEDIUM' : 'HIGH';
    
    console.log(`\n📈 Overall Security Score: ${severity}`);
    console.log(`Total Issues: ${totalIssues}`);
    
    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      issues: this.issues,
      warnings: this.warnings,
      totalIssues,
      severity
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../security-audit-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📄 Report saved to: security-audit-report.json');
  }

  // Run all audits
  async run() {
    console.log('🛡️  DomainETF Lite Security Audit');
    console.log('=====================================\n');
    
    try {
      await this.auditContracts();
      await this.auditFrontend();
      this.generateReport();
      
      if (this.issues.length > 0) {
        console.log('\n❌ Security audit failed with critical issues');
        process.exit(1);
      } else {
        console.log('\n✅ Security audit passed');
        process.exit(0);
      }
    } catch (error) {
      this.log('error', `Audit failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new SecurityAuditor();
  auditor.run();
}

module.exports = SecurityAuditor;
